const initialState = {
    isLoggedIn: '',
    authorityGrade: 0,
    seachedProducts: '',
    numberOfPages: [],
    urlEndpoint: '/scores/score/average/all/2',
    userId: ''
};

const headerReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_LOGGED_IN':
            return {
                ...state,
                isLoggedIn: true
            };

        case 'SET_LOGGED_OUT':
            return {
                ...state,
                isLoggedIn: false
            };

        case 'SET_AUTHORITY_GRADE':
            return {
                ...state,
                authorityGrade: action.grade
            };

        case 'SET_SEARCHED_PRODUCTS':
            return {
                ...state,
                seachedProducts: action.products
            };

        case 'SET_NUMBER_OF_PAGES':
        return {
            ...state,
            numberOfPages: action.pages
        };

        case 'SET_URL_ENDPOINT':
        return {
            ...state,
            urlEndpoint: action.url
        };

        case 'SET_USER_ID':
        return {
            ...state,
            userId: action.userId
        };

        default:
            return state;
    }
};

export default headerReducer;