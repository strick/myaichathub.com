const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

BotSchema.methods.updateBot = function(data) {

    // Iterate over all properties in the data object
    for (let field in data) {
        // Update only if the data object has this property and not from its prototype
        if (data.hasOwnProperty(field)) {
            this[field] = data[field];
        }
    }
    return this.save();
};


module.exports = mongoose.model('Bot', BotSchema);
