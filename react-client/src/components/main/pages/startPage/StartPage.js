import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { authenticationStartCheck } from '../../../helpers/users';
import { setLoggedIn, setLoggedOut, setAuthorityGrade, setSearchedProducts, setNumberOfPages, setUserId } from '../../../../store/actions/headerAction';

import ProductDescription from '../../../modal/ProductDescription';
import './StartPage.css';

class StartPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            specProduct: {},
            pages: [],
            pageNumber: 0,
            targetElement: '',
            checkIfNotLastNext: true,
            checkIfNotFirstPrevious: false,
            addToScore: '',
            rightToVoteCheck: false
        };

        this.getNextPage = this.getNextPage.bind(this);
        this.getPreviousPage = this.getPreviousPage.bind(this);
    }

    componentDidUpdate() {
        authenticationStartCheck(this);
    }

    componentWillMount() {
        Promise.all([axios.get('/scores/score/average/all'), axios.get('/scores/score/average/all/2/0')])
        .then((response) => {
            console.log(response[0].data);
            console.log(response[1].data);

            this.props.setSearchedProducts(response[1].data.message);

            const arrTemp = [];
            const numberOfPages = parseFloat(response[0].data.message.length / 2);

            console.log(numberOfPages);

            for(let i = 0; i < numberOfPages; i++) {
                arrTemp.push(i);
            }

            console.log(arrTemp);

            this.props.setNumberOfPages(arrTemp);
            console.log(this.props.numberOfPages);

            this.setState({
                pages: arrTemp
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    addDefaultSrc(ev) {
        ev.target.src = 'https://dummyimage.com/200/999999/000000&text=No+Image+Found';
    }

    getProductIdModal(product) {
        console.log(product);
        this.setState({
            specProduct: product
        });
    }

    getPages(e, page) {
        const pagingBlock = document.querySelector('#paging-block');
        const targetElement = e.target;
        let linkElements = pagingBlock.querySelector('#link-elements');

        for(let i = 0; i < linkElements.children.length; i++) {
            linkElements.children[i].classList.remove('paging-text-black');
            linkElements.children[i].classList.remove('paging-text-gray');
            linkElements.children[i].classList.remove('cursor');
            console.log(linkElements.children[i]);
        }

        console.log(targetElement);

        for(let j = 0; j < linkElements.children.length; j++) {
            if(targetElement.innerHTML === linkElements.children[j].innerHTML) {
                linkElements.children[j].classList.add('paging-text-black');
            } else {
                linkElements.children[j].classList.add('paging-text-gray');
                linkElements.children[j].classList.add('cursor');
            }
            console.log(linkElements.children[j]);
        }

        const lastTargetElementValue = parseInt(linkElements.children[linkElements.children.length - 1].innerHTML, 10);
        const firstTargetElementValue = parseInt(linkElements.children[0].innerHTML, 10);
        const targetElementValue = parseInt(targetElement.innerHTML, 10);

        console.log(targetElementValue);
        console.log(lastTargetElementValue);

        if(targetElementValue === lastTargetElementValue) {
            this.setState({
                checkIfNotLastNext: false,
                checkIfNotFirstPrevious: true
            });
        }

        if(targetElementValue === firstTargetElementValue) {
            this.setState({
                checkIfNotLastNext: true,
                checkIfNotFirstPrevious: false
            });
        }

        if(targetElementValue !== lastTargetElementValue && targetElementValue !== firstTargetElementValue) {
            this.setState({
                checkIfNotLastNext: true,
                checkIfNotFirstPrevious: true
            });
        }

        const pageSkip = page * 2;

        console.log(`${this.props.urlEndpoint}/${pageSkip}`);

        axios.get(`${this.props.urlEndpoint}/${pageSkip}`)
        .then((response) => {
            console.log(response.data.message);

            this.props.setSearchedProducts(response.data.message);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getNextPage() {
        this.setState({
            checkIfNotLastNext: true,
            checkIfNotFirstPrevious: true
        });

        const pagingBlock = document.querySelector('#paging-block');
        let targetElement = '';
        let nextElement = pagingBlock.querySelector('#next-element');
        let linkElements = pagingBlock.querySelector('#link-elements');

        console.log(linkElements);

        for(let i = 0; i < linkElements.children.length; i++) {
            if(linkElements.children[i].classList.contains('paging-text-black')) {
                targetElement = linkElements.children[i];
            }

            linkElements.children[i].classList.remove('paging-text-black');
            linkElements.children[i].classList.remove('paging-text-gray');
            linkElements.children[i].classList.remove('cursor');
        }

        console.log(targetElement);
        const nextElementValue = parseInt(targetElement.innerHTML, 10) + 1;

        for(let j = 0; j < linkElements.children.length; j++) {

            if(nextElementValue === parseInt(linkElements.children[j].innerHTML, 10)) {
                linkElements.children[j].classList.add('paging-text-black');
            } else {
                linkElements.children[j].classList.add('paging-text-gray');
                linkElements.children[j].classList.add('cursor');
            }
            console.log(linkElements.children[j]);
        }

        let markedLinkValue = '';

        for(let k = 0; k < linkElements.children.length; k++) {
            if(linkElements.children[k].classList.contains('paging-text-black')) {
                markedLinkValue = parseInt(linkElements.children[k].innerHTML, 10);
            }
        }

        const lastLinkValue = parseInt(linkElements.children[linkElements.children.length-1].innerHTML, 10);

        console.log('***********');
        console.log(markedLinkValue);
        console.log(lastLinkValue);
        console.log('***********');

        if(markedLinkValue === lastLinkValue) {
            nextElement.classList.remove('paging-text-gray');
            nextElement.classList.remove('paging-text-blue');
            nextElement.classList.remove('cursor');

            nextElement.classList.add('paging-text-gray');

            this.setState({
                checkIfNotLastNext: false
            });
        }

        const pageSkip = (markedLinkValue - 1) * 2;

        console.log(`${this.props.urlEndpoint}/${pageSkip}`);

        axios.get(`${this.props.urlEndpoint}/${pageSkip}`)
        .then((response) => {
            console.log(response.data.message);

            this.props.setSearchedProducts(response.data.message);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getPreviousPage() {
        this.setState({
            checkIfNotLastNext: true,
            checkIfNotFirstPrevious: true
        });

        const pagingBlock = document.querySelector('#paging-block');
        let targetElement = '';
        let previousElement = pagingBlock.querySelector('#previous-element');
        let linkElements = pagingBlock.querySelector('#link-elements');

        for(let i = 0; i < linkElements.children.length; i++) {
            if(linkElements.children[i].classList.contains('paging-text-black')) {
                targetElement = linkElements.children[i];
            }

            linkElements.children[i].classList.remove('paging-text-black');
            linkElements.children[i].classList.remove('paging-text-gray');
            linkElements.children[i].classList.remove('cursor');
        }

        console.log(targetElement);
        const previousElementValue = parseInt(targetElement.innerHTML, 10) - 1;

        for(let j = 0; j < linkElements.children.length; j++) {

            if(previousElementValue === parseInt(linkElements.children[j].innerHTML, 10)) {
                linkElements.children[j].classList.add('paging-text-black');
            } else {
                linkElements.children[j].classList.add('paging-text-gray');
                linkElements.children[j].classList.add('cursor');
            }
            console.log(linkElements.children[j]);
        }

        let markedLinkValue = '';

        for(let k = 0; k < linkElements.children.length; k++) {
            if(linkElements.children[k].classList.contains('paging-text-black')) {
                markedLinkValue = parseInt(linkElements.children[k].innerHTML, 10);
            }
        }

        const firstLinkValue = parseInt(linkElements.children[0].innerHTML, 10);

        console.log('***********');
        console.log(markedLinkValue);
        console.log(firstLinkValue);
        console.log('***********');

        if(markedLinkValue === firstLinkValue) {
            previousElement.classList.remove('paging-text-gray');
            previousElement.classList.remove('paging-text-blue');
            previousElement.classList.remove('cursor');

            previousElement.classList.add('paging-text-gray');

            this.setState({
                checkIfNotFirstPrevious: false
            });
        }

        const pageSkip = (markedLinkValue - 1) * 2;

        console.log(`${this.props.urlEndpoint}/${pageSkip}`);

        axios.get(`${this.props.urlEndpoint}/${pageSkip}`)
        .then((response) => {
            console.log(response.data.message);

            this.props.setSearchedProducts(response.data.message);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async gradeProduct(productId, grade) {
        console.log(productId);
        console.log(grade);

        const token = localStorage.getItem('token');

        const tokenHeader = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        axios.post('/users/user/auth', null, tokenHeader)
        .then(async (response) => {
            console.log(response.data);

            this.setState({
                rightToVoteCheck: false
            });

            const getAuthFromUser = await axios.post('/users/user/auth', null, tokenHeader);
            const userId = getAuthFromUser.data.userId;

            console.log(userId);

            const score = {
                id: productId,
                user_id: userId,
                score: grade
            };

            axios.post('/scores/score/add', score, tokenHeader)
            .then((response2) => {
                console.log(response2);
                
                const searchProductsTemp = JSON.parse(JSON.stringify(this.props.seachedProducts));
                searchProductsTemp.forEach((product, index) => {
                    let userAlreadyVoted = true;

                    product.scores.forEach((score) => {
                        if(score.user_id === userId) {
                            userAlreadyVoted = false;
                        }
                    });

                    if(product._id === productId && userAlreadyVoted) {
                        console.log(product.scores);

                        product.scores.push({
                            score: grade,
                            user_id: userId
                        });

                        let newAverageScore = 0;
                        
                        product.scores.forEach((score) => {
                            newAverageScore += score.score;
                        });
                        
                        newAverageScore = newAverageScore / product.scores.length;
                        console.log(newAverageScore);

                        product.score_average = newAverageScore;
                    }
                });

                console.log(searchProductsTemp);

                this.props.setSearchedProducts(searchProductsTemp);

                console.log(this.props.seachedProducts);
            })
            .catch((error2) => {
                console.log(error2);
            });
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                rightToVoteCheck: true
            });

            setTimeout(() => {
                this.setState({
                    rightToVoteCheck: false
                });
            }, 4000);
        });
    }

    gradeList(grade, productId) {
        const gradeCopy = grade !== null ? grade : 0;
        let gradeState = 1;
        const maxGrade = 5;
        const gradeWithoutDot = parseInt(gradeCopy, 10);
        console.log(gradeWithoutDot);
        const gradeListItems = [];
        let hasNotDotCheck = (gradeCopy.toString().indexOf('.') !== -1)  ? true : false;
        console.log(hasNotDotCheck);
        for (let i = 1; i <= maxGrade; i++) {
            if(gradeState <= gradeCopy) {
                gradeListItems.push(<i key={i} className="start-page star-gold fa fa-star hover pointer" title={gradeCopy} onClick={() => this.gradeProduct(productId, i)}></i>);
            } else {
                if(!hasNotDotCheck) {
                    gradeListItems.push(<i key={i} className="start-page star-gold fa fa-star-o hover pointer" title={gradeCopy} onClick={() => this.gradeProduct(productId, i)}></i>);
                } else {
                    hasNotDotCheck = false;
                    gradeListItems.push(<i key={i} className="start-page star-gold fa fa-star-half-o hover pointer" title={gradeCopy} onClick={() => this.gradeProduct(productId, i)}></i>);
                }
            }
            gradeState++;
        }
        return gradeListItems;
    }

    render() {
        if(this.props.seachedProducts === '') {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="pt-3 pb-3 col-12">
                                <div className="row">
                                    <div className="start-page header col pb-3">Products list</div>
                                </div>
                                <div className="start-page line-border row pt-3">
                                    <div className="start-page still-loading-header col">
                                        Loading products...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if(this.props.seachedProducts.length === 0) {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="pt-3 pb-3 col-12">
                                <div className="row">
                                    <div className="start-page header col pb-3">Products list</div>
                                </div>
                                <div className="start-page line-border row pt-3">
                                    <div className="start-page col">
                                        No products to show yet
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="pt-3 pb-3 col-12">
                                <div className="row">
                                    <div className="start-page header col pb-3">Products list</div>
                                </div>
                                {this.state.rightToVoteCheck && <div className="row">
                                    <div className="start-page red pl-3">Need to be logged in to vote</div>
                                </div>}
                                <div className="start-page line-border row pt-3">
                                    {this.props.seachedProducts.map((product) => (
                                        <div key={product._id} className="start-page smaller-header col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-4">
                                            <div className="row">
                                                <div className="col-12">{product.name}</div>
                                                <div className="col-12">
                                                    <span className="gradeBlock">
                                                        {this.gradeList(product.score_average, product._id)}
                                                    </span>
                                                    <span className="start-page regular-text ml-1">{product.scores.length}</span>
                                                </div>
                                                <div className="col-12">
                                                    <img onClick={() => this.getProductIdModal(product)} onError={this.addDefaultSrc} src={'https://res.cloudinary.com/ulmezz/image/upload/w_200,h_200,c_limit/v1542482639/ulmezz-webshop/product-images/' + product._id} alt={product.name} className="start-page pointer-on-hover" data-toggle="modal" data-target="#myModal" />
                                                </div>
                                                <div className="col-12 pt-1">Description</div>
                                                <div className="start-page regular-text col-12">{product.description}</div>
                                                <div className="col-12 pt-1">Price</div>
                                                <div className="start-page regular-text col-12">{product.price} kr</div>
                                                <div className="col-12 pt-1">Categories</div>
                                                <div className="start-page regular-text col-12">
                                                    {product.categories.map((category) => (
                                                        <span key={category.category_id}>*{category.category_name} </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="row">
                                    <div className="col-12 pt-2">
                                        <div id="paging-block" className="row">
                                            {this.props.numberOfPages.length > 1 && this.state.checkIfNotFirstPrevious ? <div id="previous-element" onClick={this.getPreviousPage} className="start-page paging-text-blue col text-right">Previous</div> : <div id="previous-element-gray" className="start-page paging-text-gray col text-right">Previous</div>}
                                                <div id="link-elements" className="start-page my-paging-selector-bar col text-center">
                                                    {this.props.numberOfPages.map((page, index) => (
                                                        index === 0 ? <span key={page} onClick={(e) => this.getPages(e, page)} className="start-page paging-text-black">{page + 1} </span> : <span key={page} onClick={(e) => this.getPages(e, page)} className="start-page paging-text-gray cursor">{page + 1} </span>
                                                    ))}
                                                </div>
                                            {this.props.numberOfPages.length > 1 && this.state.checkIfNotLastNext ? <div id="next-element" onClick={this.getNextPage} className="start-page paging-text-blue col text-left cursor">Next</div> : <div id="next-element-gray" className="start-page paging-text-gray col text-left">Next</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProductDescription product={this.state.specProduct} />
                </div>
            );
        }
    }
}

const mapStoreToProps = (store) => {
    return {
        isLoggedIn: store.hr.isLoggedIn,
        seachedProducts: store.hr.seachedProducts,
        numberOfPages: store.hr.numberOfPages,
        urlEndpoint: store.hr.urlEndpoint
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: () => dispatch(setLoggedIn()),
        setLoggedOut: () => dispatch(setLoggedOut()),
        setAuthorityGrade: (val) => dispatch(setAuthorityGrade(val)),
        setSearchedProducts: (val) => dispatch(setSearchedProducts(val)),
        setNumberOfPages: (val) => dispatch(setNumberOfPages(val)),
        setUserId: (val) => dispatch(setUserId(val))
    };
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(StartPage));