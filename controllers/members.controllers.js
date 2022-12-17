const Member = require("../models/members.models");
const axios = require("axios");

let memberCtl = {
  // get all members
  getMembers: async (request, response) => {
    // get id from query
    const { id = "" } = request.query;
    // search member with id or not
    if (id != "") {
      await Member.find({ _id: id }).then((result) => {
        result.forEach((element, key) => {
          result[key].register_at = {
            miliseconds: element.register_at,
            microseconds: element.register_at * 1000,
          };
        });
        response.status(200).json({ status: "success", data: result });
      });
    } else {
      await Member.find().then((result) => {
        result.forEach((element, key) => {
          result[key].register_at = {
            miliseconds: element.register_at,
            microseconds: element.register_at * 1000,
          };
        });
        response.status(200).json({ status: "success", data: result });
      });
    }
  },
  // add new member
  addMember: async (request, response) => {
    const { google_id, name, email, birth } = request.body;
    const date = new Date();
    // form validation
    if (!google_id || !name || !email || !birth) {
      let field = [];
      if (!google_id) {
        field.push("google_id");
      }
      if (!name) {
        field.push("name");
      }
      if (!email) {
        field.push("email");
      }
      if (!birth) {
        field.push("birth");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      // create new member with params
      const member = new Member({
        google_id: google_id,
        name: name,
        email: email,
        birth: new Date(birth).getTime(),
        register_at: date.getTime(),
      });
      // save data to database
      await member.save();
      response
        .status(201)
        .json({ status: "success", message: "account created!" });
    }
  },
  // activate member
  //* required for accept/reject tender
  activateMember: async (request, response) => {
    const { id = "" } = request.query;
    if (id != "") {
      // update data in database with status and verify
      Member.findOneAndUpdate(
        { _id: id },
        { status_agen: "active", is_verify: true },
        function (error, success) {
          if (error) {
            response
              .status(404)
              .json({
                status: "error",
                message: "cannot proceed activation, check details!",
                details: error,
              });
          } else {
            response
              .status(200)
              .json({
                status: "success",
                message: `success activate member with id: ${id}`,
              });
          }
        }
      );
    } else {
      response
        .status(400)
        .json({ status: "error", message: "enter member id!" });
    }
  },
  showProperty: async (request, response) => {
    // get data from json-server
    axios.get("http://localhost:3001/property").then((result) => {
      response.status(200).json({ status: "success", data: result.data });
    });
  },
  // add bookmark
  addBookmark: async (request, response) => {
    const { id, property_id } = request.body;
    if (!id || !property_id) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      if (!property_id) {
        field.push("property_id");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      Member.findOneAndUpdate(
        { _id: id },
        { $addToSet: { bookmarks: property_id } },
        function (error, success) {
          if (error) {
            response
              .status(400)
              .json({ status: "error", message: "cannot execute request!" });
          } else {
            if (success != null) {
              success.bookmarks.forEach((element) => {
                // if agent already accept the offer
                if (element == property_id) {
                  response
                    .status(400)
                    .json({
                      status: "error",
                      message: "you already bookmark this property",
                    });
                }
              });
            } else {
              response
                .status(404)
                .json({ status: "error", message: `no member with id: ${id}` });
            }
            if (!response.headersSent) {
              response
                .status(200)
                .json({
                  status: "success",
                  message: `success bookmark property with id: ${property_id}!`,
                });
            }
          }
        }
      );
    }
  },
  checkBookmark: async (request, response) => {
    const { id } = request.body;
    if (!id) {
      response
        .status(400)
        .json({ status: "error", message: "please enter member id!" });
    } else {
    }
  },
};

module.exports = memberCtl;
