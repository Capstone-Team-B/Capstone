const removeEmpty = (obj) => {
    /*     return obj.filter(function (el) {
        return el != null;
    }); */

    const array = Object.entries(obj);
    var arrayFiltered = [];
    array.map((arr) => {
        if (arr[1].location) arrayFiltered.push(arr[1]);
    });
    return arrayFiltered;
};

export { removeEmpty };
