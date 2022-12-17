const express = require("express");
const tendersCtl = require("../controllers/tenders.controllers");
const router = express.Router();
const tenderCtl = require("../controllers/tenders.controllers");

router.get("/", tenderCtl.daftarInformasi);
router.post("/add", tenderCtl.hubungiAgen);
router.post("/addQR", tenderCtl.hubungiAgenDenganQR);
router.post("/action", tenderCtl.tentukanTender);
router.get("/daftarAgen", tenderCtl.daftarAgenTender);
router.post("/accept", tenderCtl.pilihAgenTender);
router.post("/schedule", tenderCtl.aturJadwalSurvei);
router.get("/daftarTender", tendersCtl.daftarTender);
router.get("/agenda", tendersCtl.agenda);
router.get("/checkUserHasAuction", tendersCtl.checkUserHasAuction);
router.post("/auctionIsTimeup", tendersCtl.auctionIsTimeup);
router.get(
  "/getAuctionFromCollectionByIdFollower",
  tendersCtl.getAuctionFromCollectionByIdFollower
);
router.get("/getAuctionFromId/:id", tendersCtl.getAuctionFromId);
router.post("/rejectTender", tendersCtl.rejectTender);
router.post("/followTender", tendersCtl.followTender);
router.post("/unfollowTender", tendersCtl.unfollowTender);
router.post("/cancelSurvey", tendersCtl.cancelSurvey);

module.exports = router;
