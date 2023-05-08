const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');

app.use(express.json({ limit: '500mb' }));

const port = process.env.PORT || 8000;
const mongoURL = process.env.MONGO_URL;

const cors = require('cors');
const path = require('path');

// Enable CORS for all routes
app.use(cors());
// Connect to MongoDB with Mongoose
mongoose.connect('mongodb+srv://ahmetcankur07:Uw01RSljdLwdJBGy@b2cbages.nvxpgfy.mongodb.net/B2cPages?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define B2cPages Schema
const B2cPagesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  base64: { type: Object, required: true }
});
// Define SelectedTemplate Schema
const SelectedTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const AgreementsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true }
});
const SocialMediaAccountsSchema = new mongoose.Schema({
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  youtube: { type: String },
  linkedin: { type: String }
});
const AboutFooter = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  website: { type: String },
});
const SwipperCoursel = new mongoose.Schema({
  myData: {
    type: [String],
    required: true
  },
  active: { 
    type: Number,
    required: true
  }
});
const Locations = new mongoose.Schema({
  location: { type: String },
});

const SwipperCourselModel = mongoose.model("SwipperCoursel", SwipperCoursel);
const B2cPages = mongoose.model("B2cPages", B2cPagesSchema);
const SelectedTemplate = mongoose.model("SelectedTemplate", SelectedTemplateSchema);
const Agreements = mongoose.model("Agreements", AgreementsSchema);
const SocialMediaAccount = mongoose.model("SocialMediaAccount", SocialMediaAccountsSchema);
const AboutFooterModel = mongoose.model("AboutFooterModel", AboutFooter);
const LocationsModel = mongoose.model("LocationsModel", Locations);


/////////////////////////////////////////////////////////////////////////////
app.get('/',function(req,res) {
    res.sendFile( __dirname + "/" + "index.html");
});

// Define GET method to get a specific B2cPage by ID
app.get('/b2cpagesbase64/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const b2cPage = await B2cPages.findOne({ name });
    if (!b2cPage) {
      return res.status(404).send('B2cPage not found');
    }
    res.send(b2cPage);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define GET method to get all B2cPages
app.get('/b2cpagesbase64', async (req, res) => {
  try {
    const b2cPages = await B2cPages.find({});
    res.send(b2cPages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Define POST method to add new B2cPage
app.post('/b2cpagesbase64', async (req, res) => {
  const { name, base64 } = req.body;
  try {
    const b2cPages = new B2cPages({
      name,
      base64
    });
    await b2cPages.save();
    res.send(b2cPages);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

// Define DELETE method to delete SelectedTemplate by ID
app.delete('/b2cpagesbase64/:name', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedb2cPages = await B2cPages.findByIdAndDelete(id);
    res.send(deletedb2cPages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define Put method to update B2cPage by ID
app.put('/b2cpagesbase64/:name', async (req, res) => {
  const { name } = req.params;
  const { base64 } = req.body;

  try {
    const updatedB2cPage = await B2cPages.findOneAndUpdate({ name }, {
      base64: base64,
    }, { new: true });

    if (!updatedB2cPage) {
      return res.status(404).send('B2cPage not found');
    }
    res.send(updatedB2cPage);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//////////////////////////////////////////////////////////////

// Define GET method to get a specific SelectedTemplate by ID
app.get('/select-template/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const selectedTemplate = await SelectedTemplate.findById(id);
    if (!selectedTemplate) {
      return res.status(404).send('SelectedTemplate not found');
    }
    res.send(selectedTemplate);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define GET method to get all SelectedTemplates
app.get('/select-template', async (req, res) => {
  try {
    const selectedTemplates = await SelectedTemplate.find({});
    res.send(selectedTemplates);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define POST method to add new SelectedTemplate
app.post('/select-template', async (req, res) => {
  const { name } = req.body;
  try {
    const selectedTemplate = new SelectedTemplate({ name });
    await selectedTemplate.save();
    res.send(selectedTemplate);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

// Define DELETE method to delete SelectedTemplate by ID
app.delete('/select-template/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTemplate = await SelectedTemplate.findByIdAndDelete(id);
    res.send(deletedTemplate);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define PUT method to update an existing SelectedTemplate by ID
app.put('/select-template/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedSelectedTemplate = await SelectedTemplate.findByIdAndUpdate(id, {
      name
    }, { new: true });

    if (!updatedSelectedTemplate) {
      return res.status(404).send('SelectedTemplate not found');
    }
    res.send(updatedSelectedTemplate);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//////////////////////////////////////////////////////////////


app.post('/logo', (req, res) => {
  const imageName = req.body.name;
  const imageData = req.body.data;
  const filePath = `/logo/${imageName}`;
  const buffer = Buffer.from(imageData.split(',')[1], 'base64');
  fs.writeFileSync(path.join(__dirname, filePath), buffer);
  res.json(filePath)
});

app.get('/logo', (req, res) => {
  const directoryPath = path.join(__dirname, 'logo');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send({ message: 'Failed to read directory' });
    } else {
      const imagePaths = files.map((file) => `/logo/${file}`);
      res.send({ images: imagePaths });
    }
  });
});

app.get('/logo/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'logo', req.params.filename);
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'logo/jpeg',
    'Content-Length': stat.size
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

app.delete('/logo/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, `/logo/${imageName}`);

  fs.unlink(imagePath, (err) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while deleting the logo.' });
    } else {
      res.status(200).json({ message: 'Image deleted successfully.' });
    }
  });
});

app.put('/logo/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'logo', filename);
    const imageData = req.body.data;
    const buffer = Buffer.from(imageData.split(',')[1], 'base64');
    await fs.promises.writeFile(filePath, buffer);

    res.json({ filePath });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the logo.' });
  }
});

//////////////////////////////////////////////////////////////


app.post('/images', (req, res) => {
  const imageName = req.body.name;
  const imageData = req.body.data;
  const filePath = `/images/${imageName}`;
  const buffer = Buffer.from(imageData.split(',')[1], 'base64');
  fs.writeFileSync(path.join(__dirname, filePath), buffer);
  res.json(filePath)
});

app.get('/images', (req, res) => {
  const directoryPath = path.join(__dirname, 'images');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send({ message: 'Failed to read directory' });
    } else {
      const imagePaths = files.map((file) => `/images/${file}`);
      res.send({ images: imagePaths });
    }
  });
});

app.get('/images/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'images', req.params.filename);
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'images/jpeg',
    'Content-Length': stat.size
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

app.delete('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, `/images/${imageName}`);

  fs.unlink(imagePath, (err) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while deleting the logo.' });
    } else {
      res.status(200).json({ message: 'Image deleted successfully.' });
    }
  });
});

app.put('/images/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'images', filename);
    const imageData = req.body.data;
    const buffer = Buffer.from(imageData.split(',')[1], 'base64');
    await fs.promises.writeFile(filePath, buffer);

    res.json({ filePath });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the logo.' });
  }
});

/////////////////////////////////////////////////////////////////////////////

// Define GET method to get a specific Agreements by ID
app.get('/agreements-text/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const agreements = await Agreements.findById(id);
    if (!agreements) {
      return res.status(404).send('agreements not found');
    }
    res.send(agreements);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define GET method to get all Agreements
app.get('/agreements-text', async (req, res) => {
  try {
    const agreements = await Agreements.find({});
    res.send(agreements);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define POST method to add new Agreements
app.post('/agreements-text', async (req, res) => {
  const { name, text } = req.body;
  try {
    const agreements = new Agreements({
      name,
      text
    });
    await agreements.save();
    res.send(agreements);
  } catch (err) {
    res.status(422).send(err.message);
  }
});


// Define DELETE method to delete SelectedTemplate by ID
app.delete('/agreements-text/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedagreements = await Agreements.findByIdAndDelete(id);
    res.send(deletedagreements);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define Put method to update Agreements by ID
app.put('/agreements-text/:id', async (req, res) => {
  const { id } = req.params;
  const { name, text } = req.body;

  try {
    const updatedagreements = await Agreements.findByIdAndUpdate(id, {
      name,
      text: text,
    }, { new: true });

    if (!updatedagreements) {
      return res.status(404).send('Agreements not found');
    }
    res.send(updatedagreements);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/////////////////////////////////////////////////////////////////////////////

// Define GET method to get a specific SocialMedia by ID
app.get('/social-media-accounts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const SocialMedia = await SocialMediaAccount.findById(id);
    if (!SocialMedia) {
      return res.status(404).send('SocialMedia not found');
    }
    res.send(SocialMedia);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define GET method to get all SocialMedia
app.get('/social-media-accounts', async (req, res) => {
  try {
    const SocialMedia = await SocialMediaAccount.find({});
    res.send(SocialMedia);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define POST method to add new SocialMedia
app.post('/social-media-accounts', async (req, res) => {
  const { facebook, twitter, instagram, youtube, linkedin } = req.body;
  try {
    const SocialMedia = new SocialMediaAccount({
      facebook,
      twitter,
      instagram,
      youtube,
      linkedin
    });
    await SocialMedia.save();
    res.send(SocialMedia);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

// Define Put method to update Agreements by ID
app.put('/social-media-accounts/:id', async (req, res) => {
  const { id } = req.params;
  const {
    facebook,
    twitter,
    instagram,
    youtube,
    linkedin
  } = req.body;

  try {
    const updateSocialMedia = await SocialMediaAccount.findByIdAndUpdate(id, {
      facebook,
      twitter,
      instagram,
      youtube,
      linkedin
    }, { new: true });

    if (!updateSocialMedia) {
      return res.status(404).send('updateSocialMedia not found');
    }
    res.send(updateSocialMedia);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/////////////////////////////////////////////////////////////////////////////

// Define GET method to get a specific AboutFooter by ID
app.get('/about-footer/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const AboutFooter = await AboutFooterModel.findById(id);
    if (!AboutFooter) {
      return res.status(404).send('AboutFooter not found');
    }
    res.send(AboutFooter);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define GET method to get all AboutFooter
app.get('/about-footer', async (req, res) => {
  try {
    const AboutFooter = await AboutFooterModel.find({});
    res.send(AboutFooter);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define POST method to add new AboutFooter
app.post('/about-footer', async (req, res) => {
  const {
    phone,
    email,
    address,
    website,
  } = req.body;
  try {
    const AboutFooter = new AboutFooterModel({
      phone,
      email,
      address,
      website,
    });
    await AboutFooter.save();
    res.send(AboutFooter);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

// Define Put method to update Agreements by ID
app.put('/about-footer/:id', async (req, res) => {
  const { id } = req.params;
  const {
    phone,
    email,
    address,
    website,
  } = req.body;

  try {
    const updateAboutFooter = await AboutFooterModel.findByIdAndUpdate(id, {
      phone,
      email,
      address,
      website,
    }, { new: true });

    if (!updateAboutFooter) {
      return res.status(404).send('updateAboutFooter not found');
    }
    res.send(updateAboutFooter);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/////////////////////////////////////////////////////////////////////////////

// Define GET method to get all SwipperCoursel
app.get('/swipper-coursel', async (req, res) => {
  try {
    const SwipperCoursel = await SwipperCourselModel.find({});
    res.send(SwipperCoursel);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define POST method to add new AboutFooter
app.post('/swipper-coursel', async (req, res) => {
  const { data, active } = req.body;
  try {
    const SwipperCoursel = new SwipperCourselModel({
      myData: data,
      active: active
    });
    await SwipperCoursel.save();
    res.send(SwipperCoursel);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

// Define Put method to update Agreements by ID
app.put('/swipper-coursel/:id', async (req, res) => {
  const { data, active } = req.body;
  try {
    const SwipperCoursel = await SwipperCourselModel.findByIdAndUpdate(
      req.params.id,
      { myData: data, active: active },
      { new: true }
    );
    res.send(SwipperCoursel);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

// Define Delete method to update Coursel by ID
app.delete('/swipper-coursel/:id', async (req, res) => {
  try {
    await SwipperCourselModel.findByIdAndDelete(req.params.id);
    res.send('Deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/////////////////////////////////////////////////////////////////////////////

// Define GET method to get all Location
app.get('/location-map', async (req, res) => {
  try {
    const Location = await LocationsModel.find({});
    res.send(Location);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Define POST method to add new AboutFooter
app.post('/location-map', async (req, res) => {
  const { location } = req.body;
  try {
    const LocationConst = new LocationsModel({
      location: location,
    });
    await LocationConst.save();
    res.send(LocationConst);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

// Define Put method to update Agreements by ID
app.put('/location-map/:id', async (req, res) => {
  const { id } = req.params;
  const {
    location,
  } = req.body;

  try {
    const Locations = await LocationsModel.findByIdAndUpdate(id, {
      location
    }, { new: true });

    if (!Locations) {
      return res.status(404).send('LocationsModel not found');
    }
    res.send(Locations);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
