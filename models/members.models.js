const mongoose = require('mongoose')
const Schema = mongoose.Schema

const members = Schema({
    google_id: String,
    name: String,
    email: String,
    address: String,
    village_id: Number,
    birth: Number,
    city_area_survey: String,
    is_verify: {
        type: Boolean,
        default: false
    },
    keywords: Array,
    organization: String,
    phone: String,
    url_family_identity: String,
    url_identity_number: String,
    url_taxpayer_identification_number: String,
    photo_profile: String,
    rating: Number,
    rating_system: Number,
    register_at: Object,
    role: String,
    selfie_identity_number: String,
    status_agen: {
        type: String,
        enum : ['active','inactive'],
        default: 'inactive'
    },
    tokens: Array,
    total_closing: {
        type: Number,
        default: 0
    },
    total_house_sales: {
        type: Number,
        default: 0
    },
    total_store_sales: {
        type: Number,
        default: 0
    },
    total_survey: {
        type: Number,
        default: 0
    },
    bookmarks: Array,
    verify_by: String,
    verify_code: String,
    warning: Array
})
module.exports = mongoose.model("members", members)