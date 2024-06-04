const data = `SH348503,O567843,2018-12-10 15:08:58 -0000,Jane,Smith,
SH465980,O936726,2018-12-11 06:08:14 -0000,John,Reynolds,
SH465994,O936726,2018-12-11 06:12:37 -0000,John,Reynolds,
SH867263,O234934,2018-12-11 18:28:51 -0000,Rebecca,Jones,
SH907346,,2018-12-12 21:12:28 -0000,Rebecca,Jones,SH867263
SH141422,O567899,2018-12-10 15:08:58 -0000,Albert,Adams,
SH923883,O567103,2023-12-10 15:08:58 -0000,Bertha,Babbage,
SH471711,O568383,2024-05-10 15:08:58 -0000,Carol,Carole,
SH927813,,2018-12-15 09:49:35 -0000,Rebecca,Jones,SH907346`;

const shipments = [];

class Shipment {
    constructor(shipmentNumber, orderNumber, date, firstName, lastName, parentShipment) {
        this.shipmentNumber = shipmentNumber;
        this.orderNumber = orderNumber;
        this.date = date;
        this.firstName = firstName;
        this.lastName = lastName;
        this.parentShipment = parentShipment;
    }
}

function formatData(data) {
    data = data.split("\n");
    data.forEach((shipment) => {
        shipment = shipment.split(',');
        shipments.push(new Shipment ( shipment[0], shipment[1], shipment[2], shipment[3], shipment[4], shipment[5]
        ));
    });
}

formatData(data);

// 1.
function printShippingData() {
    shipments.forEach((shipment, index) => {
        console.log(`Shipment #${index + 1}`);
        console.log(`Number: ${shipment.shipmentNumber}, Order Number: ${shipment.orderNumber? shipment.orderNumber : "N/A"}, Shipped: ${shipment.date}, First Name: ${shipment.firstName}, Last Name: ${shipment.lastName}, Parent Shipment: ${shipment.parentShipment? shipment.parentShipment : "N/A"}`);
    })
}

// 2. 
function getShipment(shipmentNumber) {
    const shipment = shipments.find(shipment => {
        return shipment.shipmentNumber === shipmentNumber;
    });
    if (!shipment) {
        console.log(`Shipment number ${shipmentNumber} not found`);
    }
    return shipment;
}

// 3. 
function getShipmentComputed(shipmentNumber) {
    const shipment = getShipment(shipmentNumber);
    const fullName = shipment.firstName + " " + shipment.lastName;

    let formattedDate = shipment.date.split(' ');
    formattedDate[0] = formattedDate[0].replace(/-/g,'/');
    formattedDate = formattedDate.join(' ');

    const shipmentDate = new Date(formattedDate);
    const today = new Date();

    // I looked up this conversion:
    const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utc2 = Date.UTC(shipmentDate.getFullYear(), shipmentDate.getMonth(), shipmentDate.getDate());
    const timeDiff = Math.abs(utc1 - utc2);
    const daysAgoShipped = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return {shipment, fullName, daysAgoShipped};
}

// 4. 
function getShipmentsByOrderNumber(orderNumber) {
    const result = [];
    const shipmentsByOrder = shipments.filter(shipment => {
        return shipment.orderNumber === orderNumber;
    });
    shipmentsByOrder.forEach(shipment => {
        result.push(getShipmentComputed(shipment.shipmentNumber));
    });
    return result;
}

// 5., 6., 7. 
function sortShipments({
    orderBy=OrderTypes.DATE,
    order="DESC"
}) {
    let result = []
    shipments.forEach(shipment => {
        result.push(getShipmentComputed(shipment.shipmentNumber));
    })

    let comparator;
    switch(orderBy) {
        case OrderTypes.DATE:
            comparator = "daysAgoShipped";
            break;
        case OrderTypes.FIRST_NAME:
            comparator = "firstName";
            break;
        case OrderTypes.LAST_NAME:
            comparator = "lastName";
            break;
        case OrderTypes.SHIPMENT_NUMBER:
            comparator = "shipmentNumber";
            break;
        case OrderTypes.ORDER_NUMBER:
            comparator = "orderNumber";
            break;
        case OrderTypes.PARENT_SHIPMENT:
            comparator = "parentShipment";
            break;
        default: 
            comparator = "daysAgoShipped";
    }
    if (order === "ASC") {
        result = result.sort((a, b) => {
            if (comparator === "daysAgoShipped") {
                a = a[comparator];
                b = b[comparator];
            }
            else {
                a = a.shipment[comparator];
                b = b.shipment[comparator];
            }
            return a - b;
        });
    } else if (order === "DESC") {
        result = result.sort((a, b) => {
            if (comparator === "daysAgoShipped") {
                    b = b[comparator];
                    a = a[comparator];
            } else {
                b = b.shipment[comparator]
                a = a.shipment[comparator];
            }
            return b - a;
        });
    } 
    return result;
}

// I had already been using JS rather than TS, otherwise would use Typescript enum here
const OrderTypes = Object.freeze({
    DATE:   Symbol("date"),
    FIRST_NAME:  Symbol("firstName"),
    LAST_NAME: Symbol("lastName"),
    SHIPMENT_NUMBER: Symbol("shipmentNumber"),
    ORDER_NUMBER: Symbol("orderNumber"),
    PARENT_SHIPMENT: Symbol("parentShipment")
});


// 8. 
function getOriginalShipment(shipmentNumber) {
    const shipment = getShipment(shipmentNumber);
    if (shipment.parentShipment) {
        return getOriginalShipment(shipment.parentShipment);
    } else {
        return getShipmentComputed(shipment.shipmentNumber);
    }
}


console.log("1. print shipping data:");
printShippingData();

console.log("\n2. get shipment:");
console.log(getShipment('SH348503'));

console.log("\n3. get shipment properties:");
console.log(getShipment('SH348503'));

console.log("\n4. get shipment properties by order number:");
console.log(getShipmentsByOrderNumber('O936726'));

console.log("\n5. sort by days ago shipped:");
console.log(sortShipments({orderBy: OrderTypes.DATE, order: "ASC"}));

console.log("\n6. sort by days ago shipped, ascending or descending:");
console.log(sortShipments({orderBy: OrderTypes.DATE, order: "DESC"}));

console.log("\n7. sort by shipment property:")
console.log(sortShipments({orderBy: OrderTypes.FIRST_NAME}, "ASC"));
console.log(sortShipments({orderBy: OrderTypes.LAST_NAME}, "DESC"));

console.log("\n8. get original shipment:");
console.log(getOriginalShipment('SH927813'));