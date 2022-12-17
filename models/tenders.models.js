const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tenders = Schema({
	agen: Object,
    user: Object,
    property: Object,
    confirmation_purchase: {
        type: Boolean,
        default: false  
    },
    has_schedule: {
        type: Boolean,
        default: false  
    },
    is_show: {
        type: Boolean,
        default: true
    },
    kavling_id: String,
    created_by: String,
    reason_cancel: String,
    referral: String,
    type_survey: {
        type: String,
        enum : ['percakapan','penawaran'],
        default: 'percakapan'
    },
    participants_follow: [{
        type: Schema.Types.ObjectId, ref: 'members'
    }],
    participants_reject: Array,
    meet_up_at: Object,
    created_at: Object,
    expired_at: Object
})

module.exports = mongoose.model("tenders", tenders)