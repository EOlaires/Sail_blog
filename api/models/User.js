/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	first_name: {
  		type: "string",
  		required: true
  	},
  	last_name: {
  		type: "string",
  		required: true
  	},
  	username: {
  		type: "string",
  		required: true,
      unique: true
  	},
  	password: {
  		type: "string",
  		required: true
  	}

  }

};

