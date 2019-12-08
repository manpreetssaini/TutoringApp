const connection = require("../../connection");

module.exports = {
  individualRequest: (req, res) => {
    let tutor_id = req.params.id;
    console.log(tutor_id);
  },

  filter: (req, res) => {
    let searchCriteria = req.body.searchCriteria;
    let locations = req.body.location;
    let subjects = req.body.subject;
    let student_id = req.body.studentID;
    let min_rating = req.body.rating;

    let subjectSubQuery = "";

    function filterSubjects(subjects) {
      if (Array.isArray(subjects) === false) {
        subjectSubQuery = "'" + subjects + "'";
      } else {
        for (let i = 0; i < subjects.length; i++) {
          subjectSubQuery = subjectSubQuery + "'" + subjects[i] + "'";
          if (i < subjects.length - 1) {
            subjectSubQuery = subjectSubQuery + ", ";
          }
        }
      }
    }
    filterSubjects(subjects);
    console.log(subjectSubQuery);
    console.log(subjects);

    let locationSubQuery = "";
    function filterLocations(locations) {
      if (Array.isArray(locations) === false) {
        locationSubQuery = "'" + locations + "'";
      } else {
        for (let i = 0; i < locations.length; i++) {
          locationSubQuery = locationSubQuery + "'" + locations[i] + "'";
          if (i < locations.length - 1) {
            locationSubQuery = locationSubQuery + ", ";
          }
        }
      }
    }
    filterLocations(locations);
    console.log(locationSubQuery);
    console.log(locations);

    if (locations == null || subjects == null) {
      res.render("error.ejs");
    } else {
      const filterQuery =
        "SELECT * FROM `tutors` WHERE `speciality` IN (" +
        subjectSubQuery +
        ") AND `city` IN (" +
        locationSubQuery +
        ")";

      connection.db.query(filterQuery, (err, result) => {
        if (err) {
          throw err;
        }
        // get tutor data
        let tutorsPage = new Array();
        const tutors = result.map(res => {
          return {
            tutor_id: res.tutor_id,
            user_name: res.user_name,
            speciality: res.speciality,
            location: res.city,
            description: res.description
          };
        });

        // create an array of found locations for filter
        let searchLocations = new Array();
        function addSearchLocations(tutors) {
          for (let i = 0; i < tutors.length; i++) {
            if (
              searchLocations.indexOf(tutors[i].location) === -1 &&
              searchLocations.length <= 6
            ) {
              searchLocations.push(tutors[i].location);
            }
          }
        }
        addSearchLocations(tutors);

        console.log(searchLocations);

        // create an array of found subjects for filter
        let searchSubjects = new Array();
        function addSearchSubjects(tutors) {
          for (let i = 0; i < tutors.length; i++) {
            if (searchSubjects.indexOf(tutors[i].speciality) === -1) {
              searchSubjects.push(tutors[i].speciality);
            }
          }
        }
        addSearchSubjects(tutors);

        // paginzation functions
        const pageNumber = Number(req.params.id.charAt(0));

        const tutorCount = tutors.length;
        let pageCount;
        if (tutorCount === 0) {
          pageCount = 1;
        } else {
          pageCount = Math.ceil(tutorCount / 10);
        }

        let i;
        function makePage() {
          if (tutorCount < 11) {
            for (i = 0; i < tutors.length; i++) tutorsPage.push(tutors[i]);
          } else if (Number(pageNumber) === pageCount) {
            for (i = pageNumber * 10 - 10; i < tutors.length; i++)
              tutorsPage.push(tutors[i]);
          } else {
            for (i = pageNumber * 10 - 10; i < pageNumber * 10; i++)
              tutorsPage.push(tutors[i]);
          }
        }
        makePage();

        let pageArray = new Array();
        function makePageArray() {
          for (i = 1; i < pageCount + 1; i++) pageArray.push(i);
        }
        makePageArray();

        // render results
        res.render("results", {
          tutors,
          currentPage: pageNumber,
          pageArray,
          pageCount,
          tutorCount,
          tutorsPage,
          searchCriteria,
          student_id,
          searchSubjects,
          searchLocations
        });
      });
    }
  },

  search: (req, res) => {
    let searchCriteria = req.param("searchCriteria");
    let student_id = req.param("studentID");

    const searchQuery =
      "SELECT * FROM `tutors` WHERE (`user_name` LIKE '%" +
      searchCriteria +
      "%' OR `city` LIKE '%" +
      searchCriteria +
      "%' OR `speciality` LIKE '%" +
      searchCriteria +
      "%');";
    connection.db.query(searchQuery, (err, result) => {
      if (err) {
        throw err;
      }

      // get tutor data
      let tutorsPage = new Array();
      const tutors = result.map(res => {
        return {
          tutor_id: res.tutor_id,
          user_name: res.user_name,
          speciality: res.speciality,
          location: res.city,
          description: res.description
        };
      });

      // create an array of found locations for filter
      let searchLocations = new Array();
      function addSearchLocations(tutors) {
        for (let i = 0; i < tutors.length; i++) {
          if (
            searchLocations.indexOf(tutors[i].location) === -1 &&
            searchLocations.length <= 6
          ) {
            searchLocations.push(tutors[i].location);
          }
        }
      }
      addSearchLocations(tutors);

      console.log(searchLocations);

      // create an array of found subjects for filter
      let searchSubjects = new Array();
      function addSearchSubjects(tutors) {
        for (let i = 0; i < tutors.length; i++) {
          if (searchSubjects.indexOf(tutors[i].speciality) === -1) {
            searchSubjects.push(tutors[i].speciality);
          }
        }
      }
      addSearchSubjects(tutors);

      // paginzation functions
      const pageNumber = Number(req.params.id.charAt(0));

      const tutorCount = tutors.length;
      let pageCount;
      if (tutorCount === 0) {
        pageCount = 1;
      } else {
        pageCount = Math.ceil(tutorCount / 10);
      }

      let i;
      function makePage() {
        if (tutorCount < 11) {
          for (i = 0; i < tutors.length; i++) tutorsPage.push(tutors[i]);
        } else if (Number(pageNumber) === pageCount) {
          for (i = pageNumber * 10 - 10; i < tutors.length; i++)
            tutorsPage.push(tutors[i]);
        } else {
          for (i = pageNumber * 10 - 10; i < pageNumber * 10; i++)
            tutorsPage.push(tutors[i]);
        }
      }
      makePage();

      let pageArray = new Array();
      function makePageArray() {
        for (i = 1; i < pageCount + 1; i++) pageArray.push(i);
      }
      makePageArray();

      // render results
      res.render("results", {
        tutors,
        currentPage: pageNumber,
        pageArray,
        pageCount,
        tutorCount,
        tutorsPage,
        searchCriteria,
        student_id,
        searchSubjects,
        searchLocations
      });
    });
  }
};
