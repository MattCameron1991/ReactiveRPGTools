import React, { useState } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import "./DisplayList.css";

export class DisplayColumn {
  constructor(colDisplay, listDisplayFunc, ascendingSortFunction) {
    this.colDisplay = colDisplay;
    this.listDisplayFunc = listDisplayFunc;
    this.ascendingSortFunction = ascendingSortFunction;

    this.sortFunc = this.sortFunc.bind(this);
    this.sortAscending = this.sortAscending.bind(this);
    this.sortDescending = this.sortDescending.bind(this);
  }

  sortFunc(isAscending) {
    return isAscending ? this.sortAscending : this.sortDescending;
  }

  sortAscending(a, b) {
    return this.ascendingSortFunction(a, b);
  }

  sortDescending(a, b) {
    return -this.ascendingSortFunction(a, b);
  }
}

export function DisplayList(props) {
  // headers should be a collection of DisplayColumn instances
  let headers = props.headers;
  let items = props.items;

  let [sortByIdx, setSortByIdx] = useState(0);
  let [sortAscending, setSortAscending] = useState(true);

  let headerRowContents = [];
  for (let i = 0; i < headers.length; ++i) {
    headerRowContents.push(
      <Col
        key={`dl-h-col-${i}`}
        onClick={(e) => {
          e.preventDefault();

          if (i === sortByIdx) {
            setSortAscending(!sortAscending);
          } else {
            setSortByIdx(i);
            setSortAscending(true);
          }
        }}
        className={`list-header ${i === sortByIdx && "active"}`}
      >
        {headers[i].colDisplay}{" "}
        {i === sortByIdx && <>{sortAscending ? "^" : "v"}</>}
      </Col>
    );
  }

  let filterObject = props.filterObject;
  let filterKeys = Object.keys(filterObject);

  for (let i = 0; i < filterKeys.length; ++i) {
    items = items.filter(filterObject[filterKeys[i]]);
  }

  items.sort(headers[sortByIdx].sortFunc(sortAscending));

  let contentsRows = [];
  let itemLen = items.length;
  for (let i = 0; i < itemLen; ++i) {
    contentsRows.push();
  }

  contentsRows = items.map((item, idx) => {
    return (
      <DisplayListRow
        key={`row-${props.idFunction(item)}`}
        headers={headers}
        item={item}
        idFunction={props.idFunction}
        pathRoot={props.pathRoot}
        isSelected={props.idFunction(item) === props.selectedId}
      />
    );
  });

  return (
    <>
      {/* <span>{items.length}</span> */}
      <Row className="mx-0">{headerRowContents}</Row>
      <ul className="element-list">{contentsRows}</ul>
    </>
  );
}

function DisplayListRow(props) {
  let history = useHistory();

  let { headers, item, idFunction, pathRoot, isSelected } = props;

  let innerCols = [];

  let desiredId = idFunction(item);

  let headerLen = headers.length;
  for (let h = 0; h < headerLen; ++h) {
    let headerObj = headers[h];

    innerCols.push(
      <Col key={`${desiredId}-${h}`}>{headerObj.listDisplayFunc(item)}</Col>
    );
  }

  let pathRoute = `${pathRoot}/${desiredId}`;

  let activeName = isSelected ? "active" : "";

  return (
    <li
      onClick={(e) => {
        history.push(pathRoute);
        e.preventDefault();
      }}
      className={activeName}
    >
      <Row>{innerCols}</Row>
    </li>
  );
}