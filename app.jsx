
/** @jsx React.DOM */

"use strict";

var React = require('react/addons');
var Ovid = require('Ovid');
var _ = require('lodash');


var DevCard = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState:function(){
    return {minSelectionMode:"days", field2:"value2"};
  },


  render:function(){
    var component =  React.Children.only(this.props.children);
    return(
      <div className="ui-card__content" >
        <div className="ui-card $modifier_class" style={{height:this.props.height}}>
          <div className="ui-card__content ui-form">
          <div className="ui-width-wrapper">
            <h3>{this.props.title}</h3>
            <div className="ui-row">
              <div className="ui-col-2of6">
                 {React.addons.cloneWithProps(component, _.clone(this.state))}
              </div>
              <div className="ui-col-4of6">
                <p> {this.props.description} </p>


                <fieldset className="ui-form">
                  <label>Field</label>
                <input type="text" class="short" placeholder="value" />
                  </fieldset>
                <fieldset className="ui-form">
                  <label>Field 2</label>
                    <select>
                    <option>days</option>
                    <option>weeks</option>
                    <option>months</option>
                    </select>
                </fieldset>
                <pre> <code> {this.props.markup}  </code>  </pre></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});



var App = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState:function(){
    return {firstName:"john",email:"asdfasd", id:0};
  },

  render:function(){

    var columns = [
      {key: 'field1', name: 'Field1', sortable: true},
      {key: 'field2', name: 'Field2', sortable: true},
      {key: 'field3', name: 'Field3', sortable: true},
    ];

    var rows = [{field1:'value1',field2:'value2',field3:'value3'},{field1:'value1',field2:'value2',field3:'value3'},{field1:'value1',field2:'value2',field3:'value3'}];


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

            <DevCard title="Calendar" markup={"<Calendar prop1={val} />"} description="A component for allowing the selection of a day." >
              <Ovid.Calendar />
            </DevCard>

            <DevCard title="Table" markup={"<Table columns={array} rows={array}/>"} description="Renders small tables of data; main use as a user input control when used with the CheckboxColumn">
              <Ovid.Table
            columns={columns}
            rows={rows} />
            </DevCard>


            <DevCard title="Date Picker" height={320} markup={"<DatePicker prop1={val} />"} description="Uses the Calendar for allowing a user to select a date.  Has modes for 'days', 'months' and 'years" >
              <Ovid.DatePicker />
            </DevCard>

            <DevCard title="Avatar" markup={"<Avatar prop1={val} />"} description="Displays one the following three options in order of precedence: (1) Gravatar associated with email: Show Gravatar image.  (2) First or last name provided: Show initials.  (3) Otherwise show anonymous image " >
              <Ovid.Avatar id={7} email={"adf@asd.com"} firstName={"Asf"} lastName="nnn" />
            </DevCard>


          </div>
          <div class="ui-col-2of6"></div>
          </div>
      </div>
    );
  }
});

React.renderComponent(<App />, document.getElementById('app-content'));
