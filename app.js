const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const app = express();
const port = 3000; 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); 
  });

// Define the route handler for /api/blog-stats
app.get('/api/blog-stats', async (req, res) => {
  try {
    const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';
    
    
    const headers = {
      'x-hasura-admin-secret': adminSecret,
    };

   
    const response = await axios.get(url, { headers });

    
    if (response.status === 200) {
     
      const blogData = response.data;
    //   console.log('blogData:', blogData);

      const totalBlogs = _.size(blogData);
      const longestTitleBlog = _.maxBy(blogData, (blog) => (blog.title ? blog.title.length : 0));
      const privacyBlogs = _.filter(blogData, (blog) =>
      blog.title && blog.title.toLowerCase().includes('microsoft')
      );

      
      const blogsWithTitles = _.filter(blogData, (blog) => blog.title);
    //   console.log(blogsWithTitles);
      const uniqueTitles = _.uniq(_.map(blogsWithTitles, 'title'));      
      
      const analysisResult = {
        totalBlogs,
        longestTitle: longestTitleBlog ? longestTitleBlog.title : 'N/A',
        numPrivacyBlogs: _.size(privacyBlogs),
        uniqueTitles,
      };

      
      res.json(analysisResult);
    } else {
      
      res.status(response.status).json({ error: 'Unexpected status code from the API' });
    }
  } catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route handler for /api/blog-search
app.get('/api/blog-search', async (req, res) => {
  try {
    const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';
    const query = req.query.query; 

   
    const headers = {
      'x-hasura-admin-secret': adminSecret,
    };

   
    const response = await axios.get(url, { headers });


    if (response.status === 200) {
      const blogData = response.data;

      
      const filteredBlogs = _.filter(blogData, (blog) =>
        blog.title && _.includes(_.toLower(blog.title), _.toLower(query))
      );

      
      res.json(filteredBlogs);
    } else {
      res.status(response.status).json({ error: 'Unexpected status code from the API' });
    }
  } catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
