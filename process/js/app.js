var React = require('react');
var ReactDOM = require('react-dom');
var _= require('lodash');

var AptList = require('./AptList');
var AddAppointment = require('./AddAppointment');
var SearchAppointments = require('./SearchAppointments');

var MainInterface = React.createClass({
    getInitialState:function(){
        return{
            aptBodyVisible:false,
            orderBy:'petName',
            orderDir:'asc',
            myAppointments:[],
            queryText:''
        }
    },//getInitialState

    componentDidMount:function(){
        console.log("did did did");
        this.serverRequest = $.get('./js/data-appointment.json',function(result){
            var tempApts = result;
            this.setState({
                myAppointments:tempApts
            });
        }.bind(this))
    },

    componentWillUnmount: function(){
        this.serverRequest.abort();
    },

    deleteMessage: function(item){
        var allApts = this.state.myAppointments;
        var newApts = _.without(allApts,item);
        this.setState({
            myAppointments : newApts
        });
    },

    toggleAddDisplay:function(){
        var tempVisibility = !this.state.aptBodyVisible;
        this.setState({
            aptBodyVisible: tempVisibility
        });
    },

    addItem:function(tempItem){
        var tempApts = this.state.myAppointments;
        tempApts.push(tempItem);
        this.setState({
            myAppointments:tempApts
        });
    },

    reOrder:function(orderBy,orderDir){
        this.setState({
            orderBy:orderBy,
            orderDir:orderDir
        })
    },
    searchApts(q){
        this.setState({
            queryText:q
        });
    },

    render:function(){
        var filteredApts = [];
        var orderBy = this.state.orderBy;
        var orderDir = this.state.orderDir;
        var queryText = this.state.queryText;
        var myAppointments = this.state.myAppointments;

        myAppointments.forEach(function(item){
            if((item.petName.toLowerCase().indexOf(queryText)!=-1)||
            (item.ownerName.toLowerCase().indexOf(queryText)!=-1)||
            (item.aptDate.toLowerCase().indexOf(queryText)!=-1)||
            (item.aptNotes.toLowerCase().indexOf(queryText)!=-1))
            {
                filteredApts.push(item);
            }
        })

        filteredApts = _.orderBy(filteredApts,function(item){
            return item[orderBy].toLowerCase();
        },orderDir)

        filteredApts = filteredApts.map(function(item, index){
            console.log(this);
            return(
                <AptList key = {index} singleItem = {item} whichItem = {item} onDelete={this.deleteMessage}/>
            )
        }.bind(this));

        return(
        <div className="interface">
            <div className="item-list media-list">
                <AddAppointment 
                bodyVisible = {this.state.aptBodyVisible} 
                handleToggle = {this.toggleAddDisplay} 
                addApt={this.addItem}/>
                <SearchAppointments orderBy = {this.state.orderBy}
                orderDir = {this.state.orderDir}
                onReOrder = {this.reOrder}
                onSearch = {this.searchApts}/>

                <ul className="item-list media-list">
                    {filteredApts}
                </ul>
            </div>
        </div>
        )//return
    }//render
});//MainInterface

ReactDOM.render(
    <MainInterface />,
    document.getElementById('petAppointments')
);//render

