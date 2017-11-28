var React = require('react');
var ReactDOM = require('react-dom');
var _= require('lodash');

var AptList = require('./AptList');
var AddAppointment = require('./AddAppointment');

var MainInterface = React.createClass({
    getInitialState:function(){
        return{
            aptBodyVisible:false,
            myAppointments:[]
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

    render:function(){
        var filteredApts = this.state.myAppointments;
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

