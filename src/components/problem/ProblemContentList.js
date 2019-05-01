import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    problemContentsFetchData,
    problemContentsAppendList
} from '../../actions/problem/ProblemContentAction';
import { ListGroup, ListGroupItem} from 'reactstrap';
import { properties } from '../../config/properties.js';
import PropTypes from 'prop-types'
import ProblemContentForm from "./ProblemContentForm";
import defaultavatar from '../user/default-avatar.png';


import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import './problemcontent.css';

import {
    Row,
    Col } from 'reactstrap';
import {Link} from "react-router-dom";
import ThankcoinPanel from "../thankcoin/ThankcoinPanel";


var amount=0;
var titleDecoded="";
class ProblemContentList extends Component {
    contentToRender = (html) => {


        const contentBlock = htmlToDraft(html);

        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks,
            contentBlock.entityMap);
        const editorState = EditorState.createWithContent(contentState);

        return editorState;

    }

    componentDidMount() {

        window.addEventListener('scroll', this.onScroll, false);

        this.props.fetchData(properties.problemtitle_contents+  this.props.match.params.title+ "/"+ amount);


    }

    componentDidUpdate(prevProps) {


        if (prevProps.location.pathname != this.props.location.pathname) {
            amount=0;
            this.props.fetchData(properties.problemtitle_contents + this.props.match.params.title + "/"+ amount);
        }

    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }
    onScroll = () => {
        var totalHeight = document.documentElement.scrollHeight;
        var clientHeight = document.documentElement.clientHeight;
        var scrollTop = (document.body && document.body.scrollTop)
            ? document.body.scrollTop : document.documentElement.scrollTop;
        if (totalHeight == scrollTop + clientHeight){
            amount= amount + 10;
            if (typeof this.props.appendList !== 'undefined'){
                this.props.appendList(properties.problemtitle_contents +   this.props.match.params.title+ "/"+ (amount));

            }
        }
    }

    profilePicture(picture) {
         if(picture===null){
             picture= defaultavatar;
         }
         return picture;
    }

    getTransaction(receiver, objectId)
    {

        var transaction = {
            receiver:{
                username:  receiver
            },
            objectType:"ProblemContent",
            objectId:objectId,
            name: titleDecoded
        }
        return transaction;

    }
    render() {

        if (this.props.hasErrored) {
            console.log("Sorry! There was an error loading the contents")
        }

        if (this.props.isLoading) {
            console.log("Contents are loading.")
        }

        const list=<ListGroup>

            {
                this.props.contents.map((content) => (
                    <ListGroupItem key={content.id}>

                        <Row>
                            <Col xs="2">

                                <div className="content-img" >


                                    <Link to={{
                                        pathname: '/' + content.user.username,
                                        state: {
                                            username: content.user.username
                                        }
                                    }} >
                                     <span>
                                     <img     src={this.profilePicture(content.user.profilePhotoUrl) } alt=""   />
                                     </span>
                                    </Link>



                                </div>



                            </Col>
                            <Col xs="9">

                                <div className="panel panel-default">

                                    <div className="panel-heading"><b>{content.user.username}</b></div>

                                    <Editor editorState={this.contentToRender(content.text)}

                                            readOnly={true} toolbarHidden={true} />

                                    <ThankcoinPanel transaction={ this.getTransaction(content.user.username, content.id)} currentThankAmount={content.currentThankAmount}/>

                                </div>


                            </Col>
                        </Row>

                    </ListGroupItem>


                ))}
        </ListGroup>;

        return (
            <div>

                <b>  {titleDecoded} </b>
                <ProblemContentForm problemTitle={titleDecoded}/>
                {list}


            </div>
        );
    }
}

ProblemContentList.propTypes = {
    appendList: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    contents: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {

        contents: state.problemContents,
        hasErrored: state.problemContentsHasErrored,
        isLoading: state.problemContentsIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(problemContentsFetchData(url)),
        appendList: (url) => dispatch(problemContentsAppendList(url))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemContentList);
