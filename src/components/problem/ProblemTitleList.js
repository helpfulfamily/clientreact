import React, { Component} from 'react';
import { connect } from 'react-redux';
import { problemTitleFetchData } from '../../actions/problem/ProblemTitleAction';
import {Link} from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { properties } from '../../config/properties.js';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import './problemtitle.css';
import ThankcoinPanel from "../thankcoin/ThankcoinPanel";
var amount=30;
class ProblemTitleList extends Component {

    componentDidMount() {
        var channelName = "";
        if ( typeof  this.props.channel.name!=="undefined") {
            channelName = this.props.channel.name;
        }

        this.props.fetchData(properties.problemtitle_all + "/"+ amount+"/"+ channelName);
    }

    componentDidUpdate(prevProps) {

        var channelName = "";
        if ( typeof  this.props.channel.name!=="undefined") {
            channelName = this.props.channel.name;
        }

        if (prevProps.channel.name !=  this.props.channel.name) {

            this.props.fetchData(properties.problemtitle_all + "/"+ amount+"/"+channelName);
        }

    }

    fetchMoreData = () => {
        var channelName = "";
        if ( typeof  this.props.channel.name!=="undefined") {
            channelName = this.props.channel.name;
        }

        this.props.fetchData(properties.problemtitle_all + "/"+ (10 + amount)+"/"+channelName);
     };
    getTransaction(receiver, objectId)
    {

        var transaction = {
            receiver:{
                username:  receiver
            },
            objectType:"ProblemTitle",
            objectId:objectId,
            name:""
        }
        return transaction;

    }
    render() {
        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the items</p>;
        }

        if (this.props.isLoading) {
            return <p>Loading…</p>;
        }
        var list="";
        if(typeof this.props.problemTitles!=="undefined" && this.props.problemTitles.length>0){
            list= <ListGroup className="problemtitle">
                {this.props.problemTitles.map((item, index) => (
                    <ListGroupItem  key={item.id}> <Link to={{
                        pathname: '/problemcontents/' +encodeURIComponent(item.name),
                        state: {
                            name: item.name
                        }
                    }} > {item.name}</Link>
                        <ThankcoinPanel transaction={ this.getTransaction(item.user.username, item.id)} currentThankAmount={item.currentThankAmount}/>

                    </ListGroupItem>
                ))}
            </ListGroup>;
        }

        return (
            <div>

                <div id="scrollableDiv" style={{ height: 700, overflow: "auto" }}>

                <InfiniteScroll
                        dataLength={this.props.problemTitles.length}
                        next={this.fetchMoreData}
                        hasMore={true}
                        loader={<br/>}
                        scrollableTarget="scrollableDiv"
                         >
                        {list}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

ProblemTitleList.propTypes = {
    channel: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    problemTitles: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        problemTitles: state.problemTitles,
        hasErrored: state.problemTitleHasErrored,
        isLoading: state.problemTitleIsLoading,
        channel: state.channel

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        fetchData: (url) => {console.log(url); dispatch(problemTitleFetchData(url))},

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemTitleList);
