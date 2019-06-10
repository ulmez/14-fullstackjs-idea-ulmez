export function setLoggedIn() {
    return { type: "SET_LOGGED_IN" };
};

export function setLoggedOut() {
    return { type: "SET_LOGGED_OUT" };
};

export function setAuthorityGrade(val) {
    return { type: "SET_AUTHORITY_GRADE", grade: val };
};

export function setSearchedProducts(val) {
    return { type: "SET_SEARCHED_PRODUCTS", products: val };
};

export function setNumberOfPages(val) {
    return { type: "SET_NUMBER_OF_PAGES", pages: val };
};

export function setUrlEndpoint(val) {
    return { type: "SET_URL_ENDPOINT", url: val };
};

export function setUserId(val) {
    return { type: "SET_USER_ID", userId: val };
};