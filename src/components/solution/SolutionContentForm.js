import React from 'react';

import {properties} from '../../config/properties.js';
import {Button} from "reactstrap";
import {publishSolution} from "../../actions/solution/SolutionTitleAction";
import {connect} from "react-redux";
import PropTypes from 'prop-types'
import {convertToRaw, EditorState} from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from "draftjs-to-html";
import {getToken} from "../common/process";

class SolutionContentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            solutionTitle: '',
            solutionContent: '',
            editorState: EditorState.createEmpty()
        };


        this.handleSubmitProcess = this.handleSubmitProcess.bind(this);

    }

    onEditorStateChange = (editorState) => {

        this.setState({editorState: editorState});

        this.setState({solutionContent:  draftToHtml(convertToRaw(editorState.getCurrentContent()))});


    };



    handleSubmitProcess(event) {

        event.preventDefault();

        getToken(this.props.loginUser.sso.keycloak).then( (token) => this.startPublishProcess(token))
            .catch(function(hata){

                console.log(hata)
            });

    }
    startPublishProcess = (token) =>
    {
        var apiBaseUrl = properties.solutiontitle_publishContent;



        var item = {
            "name": "",
            "text": this.state.solutionContent,
            "solutionTitle": {
                "name": this.props.solutionTitle
            }
        }


        this.props.postData(apiBaseUrl, item, token);
    }
    render() {
        if((typeof this.props.loginUser.sso!=="undefined") && this.props.loginUser.sso.isAuthenticated){
            return (
                <div>




                    <Editor
                        editorState={this.state.editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />


                    <Button color="primary" onClick={this.handleSubmitProcess}>Publish</Button>{' '}

                    <p/>
                </div>

            );
        }else{
            return ("");
                }

    }
}

SolutionContentForm.propTypes = {
    postData: PropTypes.func.isRequired,
    loginUser: PropTypes.object.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        loginUser: state.loginReducer,
        hasErrored: state.solutionTitleHasErrored,
        isLoading: state.solutionTitleIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        postData: (url, item, token) => {console.log(url); publishSolution(url, item, token)}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SolutionContentForm);
