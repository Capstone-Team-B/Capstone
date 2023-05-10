const removeEmpty = (obj) => {
    return obj.filter(function (el) {
        return el != null;
    });
};

export { removeEmpty };
