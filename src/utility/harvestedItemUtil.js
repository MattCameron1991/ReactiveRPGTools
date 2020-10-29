import React from "react";
import { Container, Col, Row, Form } from "react-bootstrap";

export function getItemReferenceFromName(name) {
  return name.replace(/\s+/gi, "_").replace(/\//gi, "-").toLowerCase();
}

export function getItemReference(harvestedItem) {
  return harvestedItem.id;
}

function simplePassthrough(val) {
  return val;
}

const ARRAY_CONC = ";;";
function joinArray(val) {
  return val.join(ARRAY_CONC);
}
function splitArray(val) {
  return val.split(ARRAY_CONC);
}

export function HarvestedItemDisplay(props) {
  let hItem = props.harvestedItem;

  return (
    <>
      {/* {JSON.stringify(hItem)} */}
      {/* <Row>
                <Col className="col-3 font-weight-bold">ReferenceId:</Col>
                <Col>{hItem.ReferenceId}</Col>
            </Row> */}
      <Row>
        <Col className="col-3 font-weight-bold">Name:</Col>
        <Col>{hItem.name}</Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Value:</Col>
        <Col>{hItem.value}</Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Weight:</Col>
        <Col>{hItem.weight}</Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Required Tools:</Col>
        <Col>
          {hItem.requiredToolNames.length === 0
            ? "-"
            : hItem.requiredToolNames.join(" and ")}
        </Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">CraftingUsage:</Col>
        <Col>
          {hItem.craftingUsage.length === 0
            ? "-"
            : hItem.craftingUsage.join(" and ")}
        </Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Description:</Col>
        <Col>
          {hItem.description.map((para, idx) => {
            return <p key={idx}>{para}</p>;
          })}
        </Col>
      </Row>
      {hItem.useText.length !== 0 && (
        <Row>
          <Col className="col-3 font-weight-bold">UseText:</Col>
          <Col>
            {hItem.useText.map((para, idx) => {
              return <p key={idx}>{para}</p>;
            })}
          </Col>
        </Row>
      )}
    </>
  );
}

export class EditingHarvestedItemDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.stringKeys = [
      {
        key: "id",
        type: "text",
        retrieve: simplePassthrough,
        store: simplePassthrough,
      },
      {
        key: "name",
        type: "text",
        retrieve: simplePassthrough,
        store: simplePassthrough,
      },
      {
        key: "value",
        type: "text",
        retrieve: simplePassthrough,
        store: simplePassthrough,
      },
      {
        key: "weight",
        type: "text",
        retrieve: simplePassthrough,
        store: simplePassthrough,
      },
      {
        key: "craftingUsage",
        type: "text",
        retrieve: joinArray,
        store: splitArray,
      },
      {
        key: "requiredToolNames",
        type: "text",
        retrieve: joinArray,
        store: splitArray,
      },
      {
        key: "description",
        type: "text",
        retrieve: joinArray,
        store: splitArray,
      },
      {
        key: "useText",
        type: "text",
        retrieve: joinArray,
        store: splitArray,
      },
    ];

    this.state = this.generateStateObject(this.props.harvestedItem);

    this.applyStateToItem = this.applyStateToItem.bind(this);
  }

  generateStateObject(harvestedItem) {
    let obj = {};
    for (let i = 0; i < this.stringKeys.length; ++i) {
      let targetValue = harvestedItem[this.stringKeys[i].key];

      obj[this.stringKeys[i].key] = this.stringKeys[i].retrieve(targetValue);
    }
    return obj;
  }

  handleInput(event, key) {
    event.preventDefault();

    console.log(`${key}: ${event.target.value}`);

    let partialObject = {};
    partialObject[key] = event.target.value;
    this.setState(partialObject);
  }

  applyStateToItem(event) {
    event.preventDefault();
    console.log("applyStateToItem");

    for (let i = 0; i < this.stringKeys.length; ++i) {
      let targetValue = this.state[this.stringKeys[i].key];

      this.props.harvestedItem[this.stringKeys[i].key] = this.stringKeys[
        i
      ].store(targetValue);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.harvestedItem.ReferenceId !==
      prevProps.harvestedItem.ReferenceId
    ) {
      this.setState(this.generateStateObject(this.props.harvestedItem));
    }
  }

  componentWillUnmount() {
    let partialObject = {};
    for (let i = 0; i < this.stringKeys.length; ++i) {
      partialObject[this.stringKeys[i]] = "";
    }
    this.setState(partialObject);
  }

  render() {
    let output = [];

    for (let i = 0; i < this.stringKeys.length; ++i) {
      let key = this.stringKeys[i];
      output.push(
        <Row key={output.length}>
          <Col className="col-3 font-weight-bold">{key.key}: </Col>
          <Col className="border">
            <input
              type={key.type}
              value={this.state[key.key]}
              style={{ width: "inherit" }}
              onChange={(e) => {
                e.preventDefault();
                this.handleInput(e, key.key);
              }}
              disabled={key.key === "ReferenceId"}
            />
          </Col>
        </Row>
      );
    }

    return (
      <Container fluid>
        <Form onSubmit={this.applyStateToItem}>
          {output}
          <input type="submit" value="Apply Changes" />
        </Form>
      </Container>
    );
  }
}