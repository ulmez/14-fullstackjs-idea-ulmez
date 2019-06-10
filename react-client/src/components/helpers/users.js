import axios from 'axios';

export function authenticationCheck(thisParam) {
    const token = localStorage.getItem('token');

    const tokenHeader = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    axios.post('/users/user/auth', null, tokenHeader)
    .then((res) => {
        console.log(res.data);
        thisParam.props.setUserId(res.data.userId);
    })
    .catch((err) => {
        console.log(err);
        thisParam.props.history.push("/login");
    });
};

export function authenticationStartCheck(thisParam) {
    const token = localStorage.getItem('token');

    const tokenHeader = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    axios.post('/users/user/auth', null, tokenHeader)
    .then((res) => {
        console.log(res.data);

        axios.get('/users/user/' + res.data.userId, tokenHeader)
        .then((result) => {
            console.log(result.data);
            thisParam.props.setLoggedIn();
            thisParam.props.setAuthorityGrade(result.data.authorityGrade);
            thisParam.props.setUserId(result.data._id);
        })
        .catch((error) => {
            console.log(error);
        });
    })
    .catch((err) => {
        console.log(err);
        thisParam.props.setLoggedOut();
    });
};

export function authenticationGradeCheck(thisParam) {
    const token = localStorage.getItem('token');

    const tokenHeader = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    axios.post('/users/user/auth', null, tokenHeader)
    .then((res) => {
        console.log(res.data);
        axios.get('/users/user/' + res.data.userId, tokenHeader)
        .then((result) => {
            console.log(result.data);
            thisParam.props.setAuthorityGrade(result.data.authorityGrade);
            if(thisParam.props.authorityGrade !== 1) {
                thisParam.props.history.push("/login");
            }
        })
        .catch((error) => {
            console.log(error);
            thisParam.props.history.push("/login");
        });
    })
    .catch((err) => {
        console.log(err);
        thisParam.props.history.push("/login");
    });
};