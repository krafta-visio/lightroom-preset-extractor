function resetValues() {
    // Reset semua elemen span yang memiliki id
    document.querySelectorAll("span[id]").forEach(span => {
        span.textContent = "";
    });
    
    // Reset tabel tone curve
    document.getElementById("table-tone-curves").innerHTML = "";
document.getElementById("table-tone-curves-red").innerHTML = "";
document.getElementById("table-tone-curves-green").innerHTML = "";
document.getElementById("table-tone-curves-blue").innerHTML = "";
    
    // Reset input file
    document.getElementById("fileInput").value = "";
}




function extractPresetName(text) {
    const presetNameMatch = text.match(/<crs:Name>\s*<rdf:Alt>\s*<rdf:li xml:lang="x-default">([^<]+)<\/rdf:li>/);
    const presetName = presetNameMatch ? presetNameMatch[1] : "-";
    document.getElementById("preset-name").textContent = presetName;
}

function extractBasicSettings(text) {
    const clarityMatch = text.match(/crs:Clarity2012="([+-]?\d+)"/);
    const saturationMatch = text.match(/crs:Saturation="([+-]?\d+)"/);
    const sharpnessMatch = text.match(/crs:Sharpness="([+-]?\d+)"/);

    document.getElementById("basic-clarity").textContent = clarityMatch ? clarityMatch[1] : "-";
    document.getElementById("basic-saturation").textContent = saturationMatch ? saturationMatch[1] : "-";
    document.getElementById("basic-sharpen").textContent = sharpnessMatch ? sharpnessMatch[1] : "-";
}

function extractToneSettings(text) {
    const contrastMatch = text.match(/crs:Contrast2012="([+-]?\d+)"/);
    const highlightsMatch = text.match(/crs:Highlights2012="([+-]?\d+)"/);
    const shadowsMatch = text.match(/crs:Shadows2012="([+-]?\d+)"/);
    const whitesMatch = text.match(/crs:Whites2012="([+-]?\d+)"/);
    const blacksMatch = text.match(/crs:Blacks2012="([+-]?\d+)"/);

    document.getElementById("basic-contrast").textContent = contrastMatch ? contrastMatch[1] : "-";
    document.getElementById("basic-highlights").textContent = highlightsMatch ? highlightsMatch[1] : "-";
    document.getElementById("basic-shadows").textContent = shadowsMatch ? shadowsMatch[1] : "-";
    document.getElementById("basic-whites").textContent = whitesMatch ? whitesMatch[1] : "-";
    document.getElementById("basic-blacks").textContent = blacksMatch ? blacksMatch[1] : "-";
}



function extractToneCurve(text) {
    function extractCurveValues(tag) {
        const match = text.match(new RegExp(`<crs:${tag}>\\s*<rdf:Seq>([\\s\\S]*?)<\\/rdf:Seq>`));
        return match ? [...match[1].matchAll(/<rdf:li>(\d+, \d+)<\/rdf:li>/g)].map(m => m[1]) : [];
    }

    const curves = {
        "table-tone-curves": "ToneCurvePV2012",
        "table-tone-curves-red": "ToneCurvePV2012Red",
        "table-tone-curves-green": "ToneCurvePV2012Green",
        "table-tone-curves-blue": "ToneCurvePV2012Blue"
    };
    
    for (const [tableId, tag] of Object.entries(curves)) {
        const values = extractCurveValues(tag);
        const table = document.getElementById(tableId);
        if (table) table.innerHTML = values.length ? values.map(value => `<tr><td>${value}</td></tr>`).join("\n") : "<tr><td>No Data</td></tr>";
    }
}




function extractHSLAdjustments(text) {
    const colors = ["Red", "Orange", "Yellow", "Green", "Aqua", "Blue", "Purple", "Magenta"];
    colors.forEach(color => {
        const hueMatch = text.match(new RegExp(`crs:HueAdjustment${color}="([+-]?\\d+)"`));
        const satMatch = text.match(new RegExp(`crs:SaturationAdjustment${color}="([+-]?\\d+)"`));
        const lumMatch = text.match(new RegExp(`crs:LuminanceAdjustment${color}="([+-]?\\d+)"`));
        
        document.getElementById(`HSLHue${color}`).textContent = hueMatch ? hueMatch[1] : "0";
        document.getElementById(`HSLSat${color}`).textContent = satMatch ? satMatch[1] : "0";
        document.getElementById(`HSLLum${color}`).textContent = lumMatch ? lumMatch[1] : "0";
    });
}



function extractColorGradingValues(text) {
    function extractValue(key) {
        const match = text.match(new RegExp(`${key}="([+-]?\\d+)"`));
        return match ? match[1] : "N/A";
    }

    // Shadow
    document.getElementById("GradingShadowHue").textContent = extractValue("crs:SplitToningShadowHue");
    document.getElementById("GradingShadowSat").textContent = extractValue("crs:SplitToningShadowSaturation");
    document.getElementById("GradingShadowLum").textContent = extractValue("crs:ColorGradeShadowLum");

    // Midtone
    document.getElementById("GradingMidtoneHue").textContent = extractValue("crs:ColorGradeMidtoneHue");
    document.getElementById("GradingMidtoneSat").textContent = extractValue("crs:ColorGradeMidtoneSat");
    document.getElementById("GradingMidtoneLum").textContent = extractValue("crs:ColorGradeMidtoneLum");

    // Highlight
    document.getElementById("GradingHighlightHue").textContent = extractValue("crs:SplitToningHighlightHue");
    document.getElementById("GradingHighlightSat").textContent = extractValue("crs:SplitToningHighlightSaturation");
    document.getElementById("GradingHighlightLum").textContent = extractValue("crs:ColorGradeHighlightLum");

    // Global
    document.getElementById("GradingGlobalHue").textContent = extractValue("crs:ColorGradeGlobalHue");
    document.getElementById("GradingGlobalSat").textContent = extractValue("crs:ColorGradeGlobalSat");
    document.getElementById("GradingGlobalLum").textContent = extractValue("crs:ColorGradeGlobalLum");

    // Balance & Blending
    document.getElementById("GradingBalance").textContent = extractValue("crs:SplitToningBalance");
    document.getElementById("GradingBlending").textContent = extractValue("crs:ColorGradeBlending");
}












function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const text = event.target.result;
            extractPresetName(text);
            extractBasicSettings(text);
            extractToneSettings(text);
            extractToneCurve(text);
            extractHSLAdjustments(text);
            extractColorGradingValues(text);
        };
        reader.readAsText(file);
    }
}

document.getElementById("fileInput").addEventListener("change", handleFileUpload);


