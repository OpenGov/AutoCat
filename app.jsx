
/** @jsx React.DOM */

"use strict";

var React = window.React = require('react/addons');
var Ovid = require('Ovid');
var _ = window._ =  require('lodash');



/**
 * Container for components: provides auto-wiring of the child components props with input controls inferred by the
 * property types (TOdo:  finish this/ add logic for generating correct input controls based on provided types in props.initState)
 */

var DevCard = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getDefaultProps:function(){
    return {initState:{}};
  },

  getInitialState:function(){
    return _.cloneDeep(this.props.initState);
  },


  render:function(){
    var component =  React.Children.only(this.props.children);
    var name = component.constructor.displayName;
    var propString = _.map(this.state ,function(val,key){ return key + "={" + val.data + "}";}).join(" ");
    var markupString = "<" + name + " " + propString + " />";

    var boundInputs = !_.isEmpty(this.state) ? _.map(this.state ,function(val,field){
      return this.renderTypedInput(field);
    }, this) : null;

    return(
      <div className="ui-card__content" >
        <div className="ui-card $modifier_class" style={{height:this.props.height}}>
          <div className="ui-card__content ui-form">
          <div className="ui-width-wrapper">
            <h3>{name}</h3>
            <div className="ui-row">
              <div className="ui-col-2of6">
                 {React.addons.cloneWithProps(component, _.mapValues(this.state,function(v,k){ return v.data;}) )}
              </div>
              <div className="ui-col-4of6">
                <p> {this.props.description} </p>
                 {boundInputs}
                <pre> <code> {markupString}  </code>  </pre></div>
              </div>
            </div>
          </div>
        </div>

      {this.state.errors ? JSON.stringify(this.state.errors) : null}

      </div>
    );
  },

  renderTypedInput:function(field){

    var type = this.state[field]['type'];

    var changeHandler = function(evt){
      var val = evt.target.value;
      var newData = {};

      if (type === "array" || type === "object"){
        try {
          val = JSON.parse(val);

          newData[field] = {data:val, type:type};

          this.setState(newData);

        }
        catch(e){
          //TODO: figure out how to handle invalid input being live-entered -- could mean not using 'controlled components'?
          var errColl = this.state.errors ?  _.cloneDeep(this.state.errors) : [];
          errColl.push(e.message);
          this.setState({errors:errColl});

        }
      }
      else{
        newData[field] = {data:val, type:type};
        this.setState(newData);
      }



    }.bind(this);


    var inputVal = (type === "array" || type === "object") ? JSON.stringify(this.state[field]['data']) : this.state[field]['data'];


    var inputTypeHash = {array:"text", object:"text", string:"text", date:"date", number:"number"};


    return (
      <fieldset className="ui-form">
        <label>{field}</label>

        <input type={inputTypeHash[type]} onChange={changeHandler}  value={inputVal} />
      </fieldset>
    );
  }

});



var App = React.createClass({
  render:function(){
    return (
      <div className="ui-width-wrapper">
        <div className="ui-row">
          <div className="ui-col-4of6">

          <div className="ui-card__content" >
            <div className="ui-card $modifier_class" style={{height:this.props.height}}>
              <div className="ui-card__content ui-form">
                <ol className="breadcrumb devcards-breadcrumb">
                  <li><a  href="#" >home</a></li>
                  <li><a  href="#" >form components</a></li>
                </ol>
              </div>
            </div>
          </div>

            <DevCard initState={{minSelectionMode:{type:"string", data:"days"} }}  description="A component for allowing the selection of a day." >
              <Ovid.Calendar />
            </DevCard>

            <DevCard initState={{columns:{type:"array", data:[{key: 'field1', name: 'Field1', sortable: true}, {key: 'field2', name: 'Field2', sortable: true}, {key: 'field3', name: 'Field3', sortable: true}]}, rows:{type:"array", data:[{field1:'value1',field2:'value2',field3:'value3'},{field1:'value1',field2:'value2',field3:'value3'},{field1:'value1',field2:'value2',field3:'value3'}]}}} description="Renders small tables of data; main use as a user input control when used with the CheckboxColumn">
              <Ovid.Table/>
            </DevCard>


            <DevCard  initState={{minSelectionMode:{type:"string", data:"months"}}}  height={320} description="Uses the Calendar for allowing a user to select a date.  Has modes for 'days', 'months' and 'years" >
              <Ovid.DatePicker />
            </DevCard>

            <DevCard initState={{id:{type:"number",data:7}, email:{type:"string", data:"johndoe@gmail.com"}, firstName:{type:"string", data:"john"}, lastName:{type:"string", data:"doe"}}} description="Displays one the following three options in order of precedence: (1) Gravatar associated with email: Show Gravatar image.  (2) First or last name provided: Show initials.  (3) Otherwise show anonymous image " >
              <Ovid.Avatar />
            </DevCard>

          </div>
          <div class="ui-col-2of6"></div>
          </div>
      </div>
    );
  }
});

React.renderComponent(<App />, document.getElementById('app-content'));
