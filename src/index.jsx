import React from "react";
import ReactDOM from "react-dom";


const cardLabels = [
    {
        title: "Facial Treatment",
        text: "All facials performed using Spa (Dead Sea natural mineral skincare) and include eyebrow trim.",
        thumb: "img/facial.jpg"
    },
    {
        title: "Body Treatment",
        text: "Including manicures, pedicures, shellac, tanning treatment and a range of massages.",
        thumb: "img/body.jpg"
    },
    {
        title: "Hair Removal",
        text: "Hair removal by electrolysis or wax treatment available on all parts of the body.",
        thumb: "img/hair.jpg"
    }
];


function Card(props) {
    return (
        <div key={props.content} className="card">
            {props.content}
        </div>
    );
};


function CardClosed(props) {
    return (
        <div className="card-closed" onClick={props.onClick}>
            <div className="card-thumb">
                <img src={props.info.thumb} alt="thumbnail"/>
            </div>
            <div className="card-caption">
                <h3>{props.info.title}</h3>
                <h5>{props.info.text}</h5>
            </div>
        </div>
    );
};

function CardOpen(props) {
    return (
        <div className="card-open">
            <div className="card-close-button" onClick={props.onClickBtn}>
                <h4><span className="glyphicon glyphicon-chevron-down"></span></h4>
            </div>
            {props.data}
        </div>
    );
};

function CardData(props) {
    return (
        <div className="card-data" key={props.index}>
            <h3>{props.title}</h3>
            <table className="table table-condensed">
                <tbody>
                    {props.entries}
                </tbody>
            </table>
        </div>
    );
};

function Field(props) {
    return (
        <tr>
            <td>
                {formatString(props.field.name)}
                {"note" in props.field ? <h6><i>{props.field.note}</i></h6> : <span/>}
            </td>
            <td className="price">{formatString(props.field.price)}</td>
        </tr>
    );
};

function formatString(str) {
    const re = /(\(.*\))/g;
    if (re.test(str)) {
        const text = str.split(re).slice(0, -1);
        return (
            <h5>
                {text[0]} <i>{text[1]}</i>
            </h5>
        );
    } else {
        return <h5>{str}</h5>
    }
};

function formatPrices(data) {
    const categories = data.map((cat, i) => {
        const entries = cat.fields.map((field, j) => {
            return <Field field={field} key={j} />
        });
        return <CardData title={cat.title} entries={entries} key={i} />
    });
    return categories;
};


class Prices extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpen0: false,
            isOpen1: false,
            isOpen2: false,
        };
    };

    handleOpenClick(i) {
        const collections = {
            0: "face",
            1: "body",
            2: "hair"
        };
        const dataField = "data" + i;
        if (!this.state[dataField]) {
            this.requestData(i, collections[i]);
        }
        const openState = "isOpen" + i;
        this.setState({[openState]: true});
    };

    closeCard(i) {
        const openState = "isOpen" + i;
        this.setState({[openState]: false});

    };

    requestData(i, collection) {
        const xhr = new XMLHttpRequest;
        const url = "/data/" + collection;
        xhr.open('GET', url, true);
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const dataField = "data" + i;
                    const data = JSON.parse(xhr.responseText);
                    this.setState({[dataField]: formatPrices(data)});
                } else {
                    console.log(xhr.statusText);
                }
            }
        };
        xhr.onerror = (e) => console.log(xhr.statusText);
        xhr.send(null);
    };

    renderCard(i) {
        const cardState = "isOpen" + i;
        const dataField = "data" + i;
        let card = this.state[cardState] ?
            <CardOpen data={this.state[dataField]} onClickBtn={() => this.closeCard(i)} /> :
            <CardClosed info={cardLabels[i]} onClick={() => this.handleOpenClick(i)} />;

        return (
            <Card content={card} />
        );
    };

    render() {
        return (
            <div className="flex-container">
                {this.renderCard(0)}
                {this.renderCard(1)}
                {this.renderCard(2)}
            </div>
        );
    };
};


ReactDOM.render(
    <Prices />,
    document.querySelector('#app')
);
