import React from 'react';

import {properties} from '../../config/properties.js';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {publishProblem} from "../../actions/problem/ProblemTitleAction";
import {connect} from "react-redux";
import PropTypes from 'prop-types'
import {EditorState, convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import problempng from "./problem.png";
import {getToken} from "../common/process";
import ChannelTagComponent from "../common/ChannelTagComponent";




class ProblemTitleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            problemTitle: '',
            problemContent: '',
            channels:[],
            editorState: EditorState.createEmpty()
        };


        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleSubmitProcess = this.handleSubmitProcess.bind(this);
        this.onAnyChangeInChannels = this.onAnyChangeInChannels.bind(this);

    }

    onEditorStateChange = (editorState) => {

        this.setState({editorState: editorState});

        this.setState({problemContent:  draftToHtml(convertToRaw(editorState.getCurrentContent()))});


    };


    onAnyChangeInChannels = (tags) => {

        var channels=[];

        tags.forEach(function(tag) {

            channels.push( {id: parseInt(tag.id), name: tag.text });

        });

        this.setState({
            channels:channels
        });
    };


    handleChangeTitle(event) {
        this.setState({problemTitle: event.target.value});
    }


    handleSubmitProcess(event) {

        event.preventDefault();

        getToken(this.props.loginUser.sso.keycloak).then( (token) => this.startPublishProcess(token))
            .catch(function(hata){

                console.log(hata)
            });
         this.props.toggle();

    }
    startPublishProcess = (token) =>
    {

        var apiBaseUrl = properties.problemtitle_publishContent;



        var item = {
            "name": "",
            "text": this.state.problemContent,
            "problemTitle": {
                "name": this.state.problemTitle,
                "channels": this.state.channels
            }
        }


        this.props.postData(apiBaseUrl, item, token);
    }

    render() {

         return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}
                   external={this.props.externalCloseBtn}>

                <ModalHeader>
                    <img src={problempng} height="54" width="54"/>  <label>  I need help! </label>
                </ModalHeader>
                <ModalBody>


                    <label>   Problem Title:  </label>
                            <br/>

                            <input type="text" size="57" value={this.state.title} onChange={this.handleChangeTitle} />

                            <ChannelTagComponent onChange={this.onAnyChangeInChannels} suggestions={this.props.loginUser.channels}/>

                        <br/>

                    <div >


                            <Editor
                                editorState={this.state.editorState}
                                wrapperClassName="demo-wrapper"
                                editorClassName="demo-editor"
                                onEditorStateChange={this.onEditorStateChange}
                            />




                    </div>


                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleSubmitProcess}>Submit</Button>{' '}
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>

            </Modal>

        );
    }
}

ProblemTitleForm.propTypes = {
    postData: PropTypes.func.isRequired,
    loginUser: PropTypes.object.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        loginUser: state.loginReducer,
        hasErrored: state.problemTitleHasErrored,
        isLoading: state.problemTitleIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        postData: (url, item, token) => {console.log(url); publishProblem(url, item, token)}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemTitleForm);
