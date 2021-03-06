import axios from "axios";


export function  userHasErrored(bool) {
    return {
        type: 'USER_HAS_ERRORED',
        hasErrored: bool
    };
}

export function userIsLoading(bool) {
    return {
        type: 'USER_IS_LOADING',
        isLoading: bool
    };
}

export function userFetchDataSuccess(users) {
    return {
        type: 'USER_FETCH_DATA_SUCCESS',
        users
    };
}


export function userFetchData(url) {
    return (dispatch) => {
      var headers = {

            'Content-Type': 'application/json',

        }

        axios.get(url, {headers: headers, params: { }})

            .then( (response)  => {
                if (!response.status) {
                    throw Error(response.statusText);
                }
                if( response.data!==""){
                    dispatch(userFetchDataSuccess(response.data.userList))
                }

            })
            .catch( (error)  => {
                dispatch(userHasErrored(true));
            })
            .then( () =>  {


                dispatch(userIsLoading(false));

            });
    };
}
