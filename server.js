const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const user = {
    full_name: 'Sharaschandra_sashank_chilli_11062004',
    dob: '11062004',
    email: 'sharaschandra_c@srmap.edu.in',
    roll_number: 'AP21110010705'
};

// POST Route
app.post('/bfhl', (req, res) => {
    let { data, file_b64 } = req.body;

    // Process numbers and alphabets from data
    let numbers = data.filter(d => !isNaN(d));
    let alphabets = data.filter(d => isNaN(d));
    let highestLowercase = alphabets.filter(d => d === d.toLowerCase())
                                    .sort((a, b) => b.localeCompare(a))[0] || null;

    // Handle file if provided
    let fileValid = false, fileMimeType = '', fileSizeKB = 0;
    if (file_b64) {
        try {
            const base64String = file_b64.split(';base64,').pop();
            const fileBuffer = Buffer.from(base64String, 'base64');
            fileMimeType = file_b64.match(/data:(.*);base64/)[1];
            fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
            fileValid = true;
        } catch (err) {
            fileValid = false;
        }
    }

    res.json({
        is_success: true,
        user_id: `${user.full_name}_${user.dob}`,
        email: user.email,
        roll_number: user.roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB
    });
});

// GET Route
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Serve HTML page from /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
