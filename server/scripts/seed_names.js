const fs = require('fs');
const path = require('path');

const themes = [
    "Nature", "Royal", "Classic", "Vintage", "Literature",
    "Celestial", "Cute", "Flowers", "Color", "Unique"
];

const origins = [
    "Latin", "Greek", "Hebrew", "German", "French", "English", "Irish", "Chinese"
];

// Helper to get random items from array
const getRandom = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Raw data - A mix of names to expand the list
const rawNames = {
    male: {
        Latin: ["Lucas", "Leo", "Felix", "Silas", "Julian", "August", "Cassius", "Marcus", "Julius", "Maximus", "Lucius", "Caius", "Magnus", "Remus", "Romulus", "Tiberius", "Valerius", "Septimus", "Octavius", "Aurelius", "Ignatius", "Benedict", "Clement", "Cornelius", "Dominic", "Fabian", "Florian", "Hadrian", "Horatio", "Justus", "Laurence", "Marcellus", "Maurice", "Peregrine", "Priscus", "Quintus", "Rufus", "Sergius", "Tacitus", "Urban", "Valentine", "Victor", "Xavier", "Amadeus", "Atticus", "Claudius", "Darius", "Emil", "Faustus", "Gaius"],
        Greek: ["Alexander", "George", "Sebastian", "Theodore", "Orion", "Phoenix", "Leander", "Atlas", "Evander", "Ambrose", "Jason", "Damon", "Pyramus", "Hector", "Achilles", "Adonis", "Aesop", "Ajax", "Alexis", "Andreas", "Apollo", "Ares", "Aristotle", "Basil", "Cadmus", "Castor", "Cephas", "Christopher", "Cleon", "Cosmo", "Cyril", "Demetrius", "Dennis", "Dion", "Dorian", "Elias", "Erasmus", "Eugene", "Eustace", "Evan", "Gregory", "Helios", "Hermes", "Homer", "Icarus", "Isidore", "Jerome", "Jonas", "Kyros", "Leonidas"],
        Hebrew: ["Noah", "James", "Gabriel", "Caleb", "Ethan", "Ezra", "Aaron", "Adam", "Asher", "Benjamin", "Daniel", "David", "Elijah", "Ephraim", "Ezekiel", "Gideon", "Hiram", "Isaac", "Isaiah", "Jacob", "Jared", "Jeremy", "Jesse", "Joel", "Jonah", "Jonathan", "Jordan", "Joseph", "Joshua", "Josiah", "Jude", "Levi", "Malachi", "Matthew", "Micah", "Michael", "Moses", "Nathan", "Nathaniel", "Omar", "Phineas", "Raphael", "Reuben", "Samuel", "Seth", "Simeon", "Solomon", "Tobias", "Uriah", "Zachary"],
        German: ["Henry", "William", "Milo", "Alaric", "Albert", "Alfred", "Archie", "Arlo", "Arnold", "Arthur", "Baldwin", "Barnaby", "Bernard", "Bruno", "Carl", "Charles", "Conrad", "Derek", "Dustin", "Edgar", "Edmund", "Edward", "Edwin", "Egbert", "Emmet", "Ernest", "Erwin", "Ferdinand", "Frank", "Frederick", "Garrett", "Gerald", "Gilbert", "Godfrey", "Gunther", "Hans", "Herbert", "Herman", "Hubert", "Hugo", "Humphrey", "Ingram", "Jarvis", "Jerry", "Klaus", "Kurt", "Lambert", "Leonard", "Leopold", "Lewis"],
        French: ["Louis", "Lucien", "Beau", "Blaise", "Bruce", "Charles", "Claude", "Corbin", "Curtis", "Dante", "Darrell", "Denis", "Dion", "Dominique", "Edmond", "Fabrice", "Francois", "Gaston", "Gautier", "Geoffrey", "Georges", "Germain", "Gervais", "Giles", "Guy", "Henri", "Harvey", "Jacques", "Jean", "Jerome", "Jules", "Julien", "Laurent", "Leon", "Leroy", "Marcel", "Marc", "Marin", "Marius", "Marshall", "Martin", "Mason", "Maurice", "Maxime", "Michel", "Noel", "Olivier", "Orville", "Pascal", "Paul"],
        English: ["Jack", "Oliver", "Harry", "Charlie", "Thomas", "Jacob", "Alfie", "Riley", "William", "James", "George", "Ethan", "Leo", "Noah", "Oscar", "Archie", "Henry", "Joshua", "Freddie", "Theo", "Isaac", "Teddy", "Finley", "Lucas", "Arthur", "Max", "Logan", "Harrison", "Mason", "Edward", "Rueben", "Arlo", "Joseph", "Sebastian", "Adam", "Elijah", "Dylan", "Rory", "Hunter", "Tommy", "Jaxon", "Toby", "Reggie", "Jenson", "Albert", "Frankie", "David", "Albie", "Louie", "Carter"],
        Irish: ["Liam", "Finn", "Connor", "Ryan", "Aidan", "Cillian", "Declan", "Fionn", "Oisin", "Sean", "Patrick", "Cian", "Darragh", "Luke", "Rian", "Eoin", "Callum", "Tadhg", "Senan", "Ronan", "Cathal", "Harry", "Daniel", "James", "Adam", "Michael", "Alex", "David", "John", "Matthew", "Jamie", "Dylan", "Charlie", "Ben", "Sam", "Liam", "Noah", "Conor", "Daniel", "James", "Jack", "Adam", "Michael", "Luke", "Harry", "Charlie", "Alex", "Oisin", "Cian", "Fionn"],
        Chinese: ["Wei", "Jun", "Ming", "Jian", "Cheng", "Bo", "Hao", "Yi", "Tian", "Long", "Feng", "Lei", "Kai", "Jin", "Sheng", "Liang", "Dong", "Guang", "Hai", "He", "Huan", "Hui", "Ji", "Kang", "Kun", "Li", "Lin", "Min", "Ning", "Ping", "Qiang", "Qing", "Ru", "Shan", "Shi", "Shu", "Tao", "Wei", "Wen", "Wu", "Xiang", "Xin", "Yang", "Ying", "Yong", "Yu", "Yuan", "Zhen", "Zheng", "Zhi"]
    },
    female: {
        Latin: ["Mia", "Luna", "Aurora", "Violet", "Rose", "Ruby", "Clementine", "Beatrix", "Nova", "Magnolia", "Arabella", "Stella", "Cordelia", "Flora", "Celeste", "Clara", "Julia", "Valentina", "Vivian", "Lydia", "Cecilia", "Diana", "Camilla", "Sylvia", "Lucia", "Antonia", "Augusta", "Aurelia", "Cassia", "Claudia", "Cornelia", "Drusilla", "Fabia", "Fausta", "Flavia", "Hadria", "Horatia", "Julia", "Justina", "Laurentia", "Liv", "Luciana", "Marcella", "Marcia", "Marina", "Martina", "Octavia", "Paula", "Portia", "Priscilla"],
        Greek: ["Sophia", "Ophelia", "Daphne", "Lyra", "Calliope", "Thalia", "Penelope", "Chloe", "Iris", "Elara", "Zoe", "Anastasia", "Alexandra", "Cassandra", "Cynthia", "Doris", "Eirene", "Eudora", "Eulalia", "Eunice", "Euphemia", "Evadne", "Evangeline", "Gaia", "Halia", "Hebe", "Helen", "Hermione", "Hestia", "Ianthe", "Ione", "Irene", "Iris", "Isadora", "Jocasta", "Kalyptso", "Kora", "Larissa", "Leda", "Lois", "Lysistrata", "Maia", "Margaret", "Melanie", "Melissa", "Nike", "Niobe", "Olympia", "Pandora", "Phoebe"],
        Hebrew: ["Isabella", "Elizabeth", "Seraphina", "Abigail", "Ada", "Anna", "Ariel", "Ava", "Bethany", "Deborah", "Delilah", "Dinah", "Eden", "Edna", "Eliza", "Esther", "Eve", "Hannah", "Hulda", "Jael", "Jemima", "Joanna", "Judith", "Leah", "Lillian", "Magdalene", "Mara", "Martha", "Mary", "Miriam", "Naomi", "Rachel", "Rebecca", "Ruth", "Salome", "Sarah", "Sharon", "Shiloh", "Susanna", "Talia", "Tamara", "Tirzah", "Yael", "Zipporah", "Adina", "Atarah", "Ayala", "Batya", "Chaya", "Davina"],
        German: ["Emma", "Amelia", "Alice", "Matilda", "Adelaide", "Ada", "Adela", "Adele", "Agatha", "Alberta", "Alice", "Amalia", "Astrid", "Beatrix", "Bernadette", "Bertha", "Brunhilde", "Carla", "Caroline", "Charlotte", "Clara", "Clothilde", "Constance", "Edith", "Elsa", "Erika", "Ernestine", "Freda", "Frederica", "Frieda", "Geraldine", "Gertrude", "Gisela", "Gretel", "Griselda", "Hedwig", "Heidi", "Helga", "Henrietta", "Hilda", "Ida", "Ilse", "Irma", "Isolde", "Johanna", "Karla", "Katrina", "Kristen", "Lorelei", "Louisa"],
        French: ["Charlotte", "Genevieve", "Esme", "Adele", "Aimee", "Amelie", "Anais", "Antoinette", "Babette", "Belle", "Bernadette", "Blanche", "Brigitte", "Camille", "Caroline", "Catherine", "Celestine", "Celine", "Chantal", "Charlotte", "Chloe", "Claire", "Clementime", "Colette", "Coralie", "Corinne", "Cosette", "Danielle", "Delphine", "Denise", "Desiree", "Dominique", "Elaine", "Eleanor", "Elise", "Elodie", "Eloise", "Emeline", "Emilie", "Estelle", "Fabienne", "Felecie", "Fleur", "Francine", "Gabrielle", "Genevieve", "Georgette", "Germaine", "Giselle", "Helene"],
        English: ["Evelyn", "Harper", "Willow", "Lily", "Daisy", "Hazel", "Scarlett", "Ivy", "Marigold", "Poppy", "Abigail", "Addison", "Alexis", "Alice", "Allison", "Amber", "Amelia", "Ann", "Ashley", "Audrey", "Autumn", "Ava", "Avery", "Bailey", "Barbara", "Beatrice", "Bella", "Beth", "Beverly", "Bonnie", "Brooke", "Caitlin", "Caroline", "Catherine", "Charlene", "Charlotte", "Chelsea", "Chloe", "Claire", "Constance", "Courtney", "Daisy", "Danielle", "Dawn", "Deborah", "Deirdre", "Delia", "Diana", "Diane", "Donna"],
        Irish: ["Aoife", "Saoirse", "Ciara", "Niamh", "Caoimhe", "Aisling", "Siobhan", "Roisin", "Clodagh", "Orla", "Cara", "Eimear", "Aoibhinn", "Sinead", "Grainne", "Fiadh", "Emer", "Sorcha", "Aine", "Muireann", "Maeve", "Erin", "Tara", "Kathleen", "Eileen", "Bridget", "Maureen", "Sheila", "Deirdre", "Fiona", "Mairead", "Catriona", "Eithne", "Finola", "Gemma", "Imogen", "Keira", "Kiera", "Lorna", "Mona", "Nola", "Nora", "Oona", "Patricia", "Paula", "Philomena", "Quinn", "Regan", "Riley", "Rory"],
        Chinese: ["Li", "Fang", "Xiu", "Jing", "Yan", "Min", "Lan", "Mei", "Hua", "Juan", "Ying", "Hui", "Xia", "Lin", "Ping", "Hong", "Zhen", "Lei", "Na", "Wei", "Yi", "Yu", "Shu", "Qin", "Yun", "Lian", "Xue", "Lu", "Ning", "Dan", "Rong", "Gui", "Zhi", "Qing", "Chun", "Fen", "Yue", "Ai", "Bao", "Bi", "Cai", "Chan", "Chen", "Cong", "Cui", "Dai", "Die", "E", "En", "Fei"]
    }
};

let allNames = [];
let idCounter = 1;

// Generate names
for (const gender in rawNames) {
    for (const origin in rawNames[gender]) {
        const namesList = rawNames[gender][origin];
        namesList.forEach(name => {
            // Assign 2-4 random themes
            const numThemes = Math.floor(Math.random() * 3) + 2;
            const assignedThemes = getRandom(themes, numThemes);

            // Ensure length theme is accurate
            const len = name.length;
            if (len >= 2 && len <= 4) assignedThemes.push("Short");
            // Medium is default-ish, maybe don't explicitly tag or tag if 5-7
            // Long 8+

            allNames.push({
                id: idCounter++,
                name: name,
                gender: gender,
                origin: origin,
                meaning: "A beautiful name", // Placeholder for bulk generation
                themes: [...new Set(assignedThemes)] // Remove duplicates
            });
        });
    }
}

// Write to file
const outputPath = path.join(__dirname, '../src/names.json');
fs.writeFileSync(outputPath, JSON.stringify(allNames, null, 2));

console.log(`Successfully generated ${allNames.length} names!`);
