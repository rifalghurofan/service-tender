const Tender = require("../models/tenders.models");
const Member = require("../models/members.models");

let tendersCtl = {
  // get all tender
  daftarInformasi: async (request, response) => {
    const { id } = request.query;
    // get with id or not
    if (id) {
      await Tender.find({ _id: id, is_show: true }).then((result) => {
        result.forEach((element, key) => {
          (result[key].created_at = {
            miliseconds: element.created_at,
            microseconds: element.created_at * 1000,
          }),
            (result[key].meet_up_at = {
              miliseconds: element.meet_up_at,
              microseconds: element.meet_up_at * 1000,
            }),
            (result[key].expired_at = {
              miliseconds: element.expired_at,
              microseconds: element.expired_at * 1000,
            });
        });
        response.status(200).json({ status: "success", data: result });
      });
    } else {
      await Tender.find({ is_show: true }).then((result) => {
        result.forEach((element, key) => {
          (result[key].created_at = {
            miliseconds: element.created_at,
            microseconds: element.created_at * 1000,
          }),
            (result[key].meet_up_at = {
              miliseconds: element.meet_up_at,
              microseconds: element.meet_up_at * 1000,
            }),
            (result[key].expired_at = {
              miliseconds: element.expired_at,
              microseconds: element.expired_at * 1000,
            });
        });
        response.status(200).json({ status: "success", data: result });
      });
    }
  },
  // create new tender with no agent
  hubungiAgen: async (request, response) => {
    // get data from body
    const {
      username,
      user_id,
      property_id,
      property_name,
      property_address,
      has_schedule,
      type_survey,
      meet_up_at,
    } = request.body;
    const date = new Date();
    // form validation
    if (
      !username ||
      !user_id ||
      !property_id ||
      !property_name ||
      !property_address ||
      !has_schedule ||
      !meet_up_at
    ) {
      let field = [];
      if (!username) {
        field.push("username");
      }
      if (!user_id) {
        field.push("user_id");
      }
      if (!property_id) {
        field.push("property_id");
      }
      if (!property_name) {
        field.push("property_name");
      }
      if (!property_address) {
        field.push("property_address");
      }
      if (!has_schedule) {
        field.push("has_schedule");
      }
      if (!meet_up_at) {
        field.push("meet_up_at");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      // create new tender
      const tender = new Tender({
        user: {
          id: user_id,
          name: username,
        },
        property: {
          id: property_id,
          name: property_name,
          address: property_address,
        },
        has_schedule: has_schedule,
        type_survey: type_survey,
        created_by: user_id,
        meet_up_at: new Date(meet_up_at).getTime(),
        created_at: date.getTime(),
        // set expired to 1 month
        //? idk how long did tender's offer last?
        expired_at: date.setMonth(date.getMonth() + 1),
      });
      // save tender to database
      await tender
        .save()
        .then(response.status(201).json({ status: "success", data: tender }));
    }
  },
  // create tender with agent
  // almost same with above
  hubungiAgenDenganQR: async (request, response) => {
    const {
      username,
      agen_name,
      user_id,
      property_id,
      property_name,
      property_address,
      agen_id,
      has_schedule,
      type_survey,
      meet_up_at,
    } = request.body;
    const date = new Date();
    if (
      !username ||
      !agen_name ||
      !user_id ||
      !property_id ||
      !property_name ||
      !property_address ||
      !agen_id ||
      !has_schedule ||
      !meet_up_at
    ) {
      let field = [];
      if (!username) {
        field.push("username");
      }
      if (!user_id) {
        field.push("user_id");
      }
      if (!agen_name) {
        field.push("agen_name");
      }
      if (!property_id) {
        field.push("property_id");
      }
      if (!property_name) {
        field.push("property_name");
      }
      if (!property_address) {
        field.push("property_address");
      }
      if (!agen_id) {
        field.push("agen_id");
      }
      if (!has_schedule) {
        field.push("has_schedule");
      }
      if (!meet_up_at) {
        field.push("meet_up_at");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      const tender = new Tender({
        user: {
          id: user_id,
          name: username,
        },
        agen: {
          id: agen_id,
          name: agen_name,
        },
        property: {
          id: property_id,
          name: property_name,
          address: property_address,
        },
        has_schedule: has_schedule,
        type_survey: type_survey,
        created_by: user_id,
        meet_up_at: new Date(meet_up_at).getTime(),
        created_at: date.getTime(),
        expired_at: date.setMonth(date.getMonth() + 1),
      });
      tender
        .save()
        .then(response.status(201).json({ status: "success", data: tender }));
    }
  },
  // set tender (agent select if he/she want to follow the tender)
  tentukanTender: async (request, response) => {
    // get data from body
    const { id, status, user_id } = request.body;
    if (!id || !status || !user_id) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      if (!status) {
        field.push("status");
      }
      if (!user_id) {
        field.push("user_id");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      // find member with user_id
      Member.findOne({ _id: user_id }, function (err, result) {
        // if null
        if (err != null) {
          response.status(400).json({
            status: "error",
            message: "error while processing request!",
            details: err,
          });
        } else if (result == null) {
          //! if agent not fond
          response
            .status(404)
            .json({ status: "error", message: "no agent with that id!" });
        } else {
          // get if agent is active or not
          if (result.status_agen != "active") {
            response.status(401).json({
              status: "error",
              message: "unauthorized!, please activate your account!",
            });
          } else {
            // check if action sent by agent is true or false
            if (status == "accept") {
              // find and update add agent id to participant_follow
              Tender.findOneAndUpdate(
                { _id: id },
                { $addToSet: { participants_follow: user_id } },
                function (error, success) {
                  if (error) {
                    response.status(400).json({
                      status: "error",
                      message: "cannot execute request!",
                    });
                  } else {
                    if (success != null) {
                      success.participants_follow.forEach((element) => {
                        // if agent already accept the offer
                        if (element == user_id) {
                          response.status(400).json({
                            status: "error",
                            message: "you already accepted this tender",
                          });
                        }
                      });
                    } else {
                      response.status(404).json({
                        status: "error",
                        message: `no tender with id: ${id}`,
                      });
                    }
                    if (!response.headersSent) {
                      response.status(200).json({
                        status: "success",
                        message: `success ${status} tender!`,
                      });
                    }
                  }
                }
              );
              // if action is reject
            } else if (status == "reject") {
              Tender.findOneAndUpdate(
                { _id: id },
                { $addToSet: { participants_reject: user_id } },
                function (error, success) {
                  if (error) {
                    response.status(400).json({
                      status: "error",
                      message: "cannot execute request!",
                    });
                  } else {
                    if (success != null) {
                      success.participants_reject.forEach((element) => {
                        if (element == user_id) {
                          response.status(400).json({
                            status: "error",
                            message: "you already rejected this tender",
                          });
                        }
                      });
                    } else {
                      response.status(404).json({
                        status: "error",
                        message: `no tender with id: ${id}`,
                      });
                    }
                    if (!response.headersSent) {
                      response.status(200).json({
                        status: "success",
                        message: `success ${status} tender!`,
                      });
                    }
                  }
                }
              );
            } else {
              response
                .status(404)
                .json({ status: "error", message: "request not found" });
            }
          }
        }
      });
    }
  },
  // show all agent that follow tender's offer
  daftarAgenTender: async (request, response) => {
    const { id } = request.query;
    if (!id) {
      response
        .status(400)
        .json({ status: "error", message: "please enter user id!" });
    } else {
      Tender.find()
        .or([{ agen: id }, { participants_follow: id }])
        .then((result) => {
          response.status(200).json({ status: "success", data: result });
        })
        .catch((error) => {
          response.status(400).json({
            status: "error",
            message: "cannot get tender data",
            details: error,
          });
        });
    }
  },
  // select tender's agent by client
  pilihAgenTender: async (request, response) => {
    const { id, user_id, agen_name } = request.body;
    if (!agen_name || !id || !user_id) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      if (!agen_name) {
        field.push("agen_name");
      }
      if (!user_id) {
        field.push("user_id");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      Tender.findOne({ _id: id }, function (err, success) {
        // if error
        if (err != null) {
          response.status(500).json({
            status: "error",
            message: "cannot process request",
            details: err,
          });
        } else {
          // check if there's data
          if (success != null) {
            // if data available, update agent in tender with agent id
            if (success.agen == null) {
              if (success.participants_follow.indexOf(user_id) > -1) {
                Tender.findOneAndUpdate(
                  { _id: id },
                  {
                    agen: {
                      id: user_id,
                      name: agen_name,
                    },
                  },
                  function (err, result) {
                    response.status(200).json({
                      status: "success",
                      message: "success accept agent in tender",
                    });
                  }
                );
              } else {
                response.status(400).json({
                  status: "error",
                  message: `no agent with id: ${id} in participants_follow!`,
                });
              }
            } else {
              if (success.agen == user_id) {
                response.status(400).json({
                  status: "error",
                  message: "you already accepted this agent!",
                });
              } else {
                response.status(400).json({
                  status: "error",
                  message: "this tender already accepted an agent!",
                });
              }
            }
          } else {
            response
              .status(404)
              .json({ status: "error", message: `no tender with id: ${id}` });
          }
        }
      });
    }
  },
  // set survey schedule
  aturJadwalSurvei: async (request, response) => {
    // set data from body
    const { id, time, type } = request.body;
    if (!id || !time || !type) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      if (!time) {
        field.push("time");
      }
      if (!type) {
        field.push("type");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      // find tender with id and update the meeting schedule
      Tender.findOneAndUpdate(
        { _id: id },
        {
          meet_up_at: new Date(time).getTime(),
          has_schedule: true,
          type_survey: type,
        },
        function (err, success) {
          if (success != null) {
            response.status(200).json({
              status: "success",
              message: "success add survey schedule!",
            });
          } else {
            response
              .status(404)
              .json({ status: "error", message: `no tender with id: ${id}` });
          }
        }
      );
    }
  },
  agenda: async (request, response) => {
    const { userId, role } = request.body;
    if (!userId || !role) {
      let field = [];
      if (!userId) {
        field.push("userId");
      }
      if (!role) {
        field.push("role");
      }
      response
        .status(400)
        .json({ status: "error", message: `please fill the field: ${field}` });
    } else {
      if (role == "member" || role == "client") {
        Tender.find({
          "user.id": userId,
          has_schedule: true,
          "agen.id": { $ne: null },
        })
          .then((result) => {
            response.status(200).json({ status: "success", data: result });
          })
          .catch((err) => {
            response.status(400).json({
              status: "error",
              message: "cannot get tender data",
              details: err,
            });
          });
      } else if (role == "agen") {
        Tender.find({
          "agen.id": userId,
          // created_by: {$ne: null},
          // has_schedule: true
        })
          .then((result) => {
            response.status(200).json({ status: "success", data: result });
          })
          .catch((err) => {
            response.status(400).json({
              status: "error",
              message: "cannot get tender data",
              details: err,
            });
          });
      } else {
        response.status(400).json({
          status: "error",
          message: "no role found!",
          data: {},
        });
      }
    }
  },

  checkUserHasAuction: async (req, res) => {
    const { created_by, user_id, property_id } = req.query;
    if (!created_by || !user_id || !property_id) {
      let field = [];
      if (!created_by) {
        field.push("created_by");
      }
      if (!user_id) {
        field.push("user_id");
      }
      if (!property_id) {
        field.push("property_id");
      }
      res.status(400).json({
        status: "error",
        message: `please fill the field: ${field}`,
      });
    } else {
      await Tender.find({
        created_by: created_by,
        "user.id": user_id,
        is_show: true,
        "property.id": property_id,
        expired_at: { $gte: Date.now() },
      })
        .then((data) => {
          if (data.length > 0) {
            res.json({
              status: "OK",
              message: "data found",
              data: data,
            });
          } else {
            res.json({
              status: "OK",
              message: "data not found",
              data: data,
            });
          }
        })
        .catch((err) => {
          res.status(200).json({
            status: "ERR",
            details: err,
          });
        });
    }
  },
  getAuctionFromCollection: async (request, response) => {
    const { id } = request.query;
    if (!id) {
      response
        .status(400)
        .json({ status: "error", message: "please enter id!" });
    } else {
      Tender.find({ "user.id": id, agen: null, is_show: true })
        .then((result) => {
          response.status(200).json({ status: "success", data: result });
        })
        .catch((error) => {
          response.status(400).json({
            status: "error",
            message: "cannot get tender!",
            details: error,
          });
        });
    }
  },

  auctionIsTimeup: async (req, res) => {
    const { id } = req.query;
    Tender.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          is_show: false,
          reason_cancel: "Masa Tenggang habis",
        },
      },
      { new: true }
    ).then((data) => {
      res
        .status(200)
        .json({
          status: "OK",
          data: data,
        })
        .catch((err) => {
          res.status(200).json({
            status: "ERR",
            details: err,
          });
        });
    });
  },
  getAuctionFromCollectionByIdFollower: async (req, res) => {
    const { id } = req.query;
    Tender.find({
      participants_follow: id,
      agen: null,
    })
      .then((data) => {
        res.status(200).json({
          status: "OK",
          data: data,
        });
      })
      .catch((err) => {
        res.status(200).json({
          status: "ERR",
          message: "not found",
          details: err,
        });
      });
  },

  rejectTender: async (rea, res) => {
    const { id, agen_id } = req.query;
    if (!id || !agen_id) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      if (!agen_id) {
        field.push("agen_id");
      }
      res.status(400).json({
        status: "error",
        message: `please fill the field: ${field}`,
      });
    } else {
      Tender.findOneAndUpdate(
        { _id: id },
        { $set: { participants_reject: agen_id } },
        { new: true }
      )
        .then((data) => {
          res.status(200).json({
            status: "OK",
            data: data,
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: "ERR",
            details: err,
          });
        });
    }
  },
  daftarTender: async (req, res) => {
    const { user_id } = req.query;
    Tender.find({
      created_by: user_id,
      agen: null,
    })
      .then((data) => {
        if (data.length > 0) {
          res.json({
            status: "OK",
            message: "data found",
            data: data,
          });
        } else {
          res.json({
            status: "OK",
            message: "data not found",
            data: data,
          });
        }
      })
      .catch((err) => {
        res.status(200).json({
          status: "ERR",
          details: err,
        });
      });
  },
  followTender: async (req, res) => {
    const { id, agen_id } = req.query;
    if (!id || !agen_id) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      if (!agen_id) {
        field.push("agen_id");
      }
      res.status(400).json({
        status: "error",
        message: `please fill the field: ${field}`,
      });
    } else {
      Tender.findOneAndUpdate(
        { _id: id },
        { $set: { participants_follow: agen_id } },
        { new: true }
      )
        .then((data) => {
          res.status(200).json({
            status: "OK",
            data: data,
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: "ERR",
            details: err,
          });
        });
    }
  },

  unfollowTender: async (req, res) => {
    const { id } = req.query;
    if (!id) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      res.status(400).json({
        status: "error",
        message: `please fill the field: ${field}`,
      });
    } else {
      Tender.findOneAndUpdate(
        { _id: id },
        { $set: { participants_follow: [] } },
        { new: true }
      )
        .then((data) => {
          res.status(200).json({
            status: "OK",
            data: data,
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: "ERR",
            details: err,
          });
        });
    }
  },

  cancelSurvey: async (req, res) => {
    const { id } = req.query;
    const { reason_cancel } = req.body;
    if (!id || !reason_cancel) {
      let field = [];
      if (!id) {
        field.push("id");
      }
      if (!reason_cancel) {
        field.push("reason_cancel");
      }
      res.status(400).json({
        status: "error",
        message: `please fill the field: ${field}`,
      });
    } else {
      Tender.findOneAndUpdate(
        { _id: id },
        { $set: { is_show: false, reason_cancel: reason_cancel } },
        { new: true }
      )
        .then((data) => {
          res.status(200).json({
            status: "OK",
            data: data,
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: "ERR",
            details: err,
          });
        });
    }
  },

  getAuctionFromId: async (req, res) => {
    const {id}= req.params
    await Tender.findOne({ _id: id })
      .then(data => {
      if (data) {
        res.status(200).json({
            status: "OK",
            data: data,
          });
      } else {
        res.status(200).json({
          status: "OK",
          message: `There is no data found wit id: ${id}`,
          data: [],
          });
      }
      })
      .catch(err => {
       res.status(200).json({
          status: "ERR",
          message: err
          });
    })
  },
};

module.exports = tendersCtl;
