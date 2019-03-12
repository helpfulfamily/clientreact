import React, { Component } from 'react';
import { connect } from 'react-redux';
import { contentsFetchData } from '../actions/contents';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { properties } from '../config/properties.js';
import PropTypes from 'prop-types'
import ProblemContentForm from "./ProblemContentForm";
import defaultuser from './default-avatar.png';
import {FaThumbsUp, FaShare} from "react-icons/fa";
import MetaTags from 'react-meta-tags';

import   './content.css';
import {
    Row,
    Col } from 'reactstrap';
import InfiniteScroll from "react-infinite-scroll-component";
var amount=9;
class ContentList extends Component {


    componentDidMount() {

        this.props.fetchData(properties.serverUrl+ properties.getTitle +  this.props.match.params.title+ "/"+ amount);
    }

    componentDidUpdate(prevProps) {

        if (prevProps.location.state.name != this.props.location.state.name) {
            this.props.fetchData(properties.serverUrl+ properties.getTitle +  this.props.match.params.title+ "/"+ amount);
        }

    }
    fetchMoreData = () => {
        this.props.fetchData(properties.serverUrl+ properties.getTitle +  this.props.match.params.title+ "/"+ (10 + amount));
    };


    render() {

        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the contents</p>;
        }

        if (this.props.isLoading) {
            return <p>Loading…</p>;
        }
        const list=<ListGroup>
            {this.props.contents.map((content) => (
                <ListGroupItem key={content.id}>

                    <Row>
                        <Col xs="2" sm="1">
                            <img  className="picture align-baseline"  src={defaultuser} alt="Generic placeholder image" />
                        </Col>
                        <Col xs="9">
                            <Row>
                                <Col>
                                    <p className="text-left align-text-top"><b>{content.username}</b></p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p className="text-justify align-middle">{content.text}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col>

                                    9 <FaThumbsUp/>

                                    {' '}

                                    9 <FaShare/>
                                </Col>
                            </Row>

                        </Col>
                    </Row>

                </ListGroupItem>
            ))}
        </ListGroup>;

        return (
            <div>
                <div className="wrapper">

                <MetaTags>
                    <title>{this.props.match.params.title} </title>
                    <meta name="description" content="Join the helpful army!" />
                    <meta property="og:title" content={this.props.match.params.title} />
                    <meta property="og:image" content="https://www.helpful.army/static/media/default-avatar.9a4d85aa.png" />
                </MetaTags>
                </div>
                <b>  {this.props.match.params.title} </b>
            <ProblemContentForm title={this.props.match.params.title}/>

                    <InfiniteScroll
                        dataLength={this.props.contents.length}
                        next={this.fetchMoreData}
                        hasMore={true}
                        loader={<br/>}
                        scrollableTarget="scrollableDivContent"
                    >
                        {list}
                    </InfiniteScroll>

            </div>
        );
    }
}

ContentList.propTypes = {
    fetchData: PropTypes.func.isRequired,
    contents: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        contents: state.contents,
        hasErrored: state.contentsHasErrored,
        isLoading: state.contentsIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(contentsFetchData(url))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentList);
