const fs = require('fs');

const formData = {
    productName: "PetCare AI",
    productDescription: "An application for pet health tracking",
    targetAudience: "Urban pet owners",
    researchObjectives: "Understand features"
};

fetch('http://localhost:3000/api/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
}).then(async (res) => {
    const text = await res.text();
    fs.writeFileSync('error_output.txt', text);
    console.log("WROTE OUTPUT TO FILE");
}).catch(e => {
    fs.writeFileSync('error_output.txt', "CRASH: " + e.message);
});
