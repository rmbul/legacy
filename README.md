To execute: run `node index.js`

Note: I wasn't able to successfully sort shipments by properties other than `daysAgoShipped`. Properties on the original `shipment` object could be accessed from the `sort` function, but I wasn't able to finish troubleshooting.


I added a commment regarding the above issue, pasting here as well:
this is the change that I believe would have fixed it (checking the typeof and using .localCompare for strings):
`if (order === "ASC") {
        result = result.sort((a, b) => {
            if (comparator === "daysAgoShipped") {
                a = a[comparator];
                b = b[comparator];
            }
            else {
                a = a.shipment[comparator];
                b = b.shipment[comparator];
            }
            if (typeof a === 'string') {
                return a.localeCompare(b);
            } else {
                return a - b;
            }
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
            if (typeof a === 'string') {
                return b.localeCompare(a);
            } else {
                return b - a;
            }
        });
    } `

There is also an error in the console.log for #7; both parameters are not wrapped {}. This is a typo and `order` should be inside the object.
