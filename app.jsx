
/** @jsx React.DOM */

"use strict";

var React = require('react/addons');
var Ovid = require('Ovid');
var _ = require('lodash');



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
    var propString = _.map(this.state ,function(val,key){ return key + "={" + val + "}";}).join(" ");
    var markupString = "<" + name + " " + propString + " />";

    var boundInputs = !_.isEmpty(this.state) ? _.map(this.state ,function(val,key){ return  (<fieldset className="ui-form">  <label>{key}</label> <input type="text" valueLink={this.linkState(key)} />   </fieldset>);  }, this) : null;

    return(
      <div className="ui-card__content" >
        <div className="ui-card $modifier_class" style={{height:this.props.height}}>
          <div className="ui-card__content ui-form">
          <div className="ui-width-wrapper">
            <h3>{name}</h3>
            <div className="ui-row">
              <div className="ui-col-2of6">
                 {React.addons.cloneWithProps(component, _.clone(this.state))}
              </div>
              <div className="ui-col-4of6">
                <p> {this.props.description} </p>
                 {boundInputs}
                <pre> <code> {markupString}  </code>  </pre></div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

            <DevCard initState={{minSelectionMode:"days"}}  description="A component for allowing the selection of a day." >
              <Ovid.Calendar />
            </DevCard>

            <DevCard initState={{columns:[{key: 'field1', name: 'Field1', sortable: true}, {key: 'field2', name: 'Field2', sortable: true}, {key: 'field3', name: 'Field3', sortable: true}], rows:[{field1:'value1',field2:'value2',field3:'value3'},{field1:'value1',field2:'value2',field3:'value3'},{field1:'value1',field2:'value2',field3:'value3'}]}} description="Renders small tables of data; main use as a user input control when used with the CheckboxColumn">
              <Ovid.Table/>
            </DevCard>


            <DevCard  initState={{minSelectionMode:"months"}}  height={320} description="Uses the Calendar for allowing a user to select a date.  Has modes for 'days', 'months' and 'years" >
              <Ovid.DatePicker />
            </DevCard>

            <DevCard initState={{id:7, email:"johndoe@gmail.com", firstName:"john", lastName:"doe"}} description="Displays one the following three options in order of precedence: (1) Gravatar associated with email: Show Gravatar image.  (2) First or last name provided: Show initials.  (3) Otherwise show anonymous image " >
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
