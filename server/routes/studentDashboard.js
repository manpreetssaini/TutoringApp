const connection = require("../../connection");

module.exports = {
  getStudentProfile: (req, res) => {
    const query = "SELECT * FROM students LIMIT 1";
    connection.db.query(query, (err, result) => {
      if (err) {
        throw err;
      }

      let student = result;

      let full_name = student[0].first_name + " " + student[0].last_name;

      const upcomingQuery =
        "SELECT * FROM student_request WHERE student_id=" +
        student[0].student_id +
        " LIMIT 3";
      connection.db.query(upcomingQuery, (err, result) => {
        if (err) {
          throw err;
        }
        const upcomingSessions = result.map(res => {
          return {
            subject: res.subject,
            topic: res.topic,
            description: res.description,
            start_time: res.start_time,
            end_time: res.end_time
          };
        });
        console.log(upcomingSessions);
        res.render("studentDashboard.ejs", {
          student,
          full_name,
          upcomingSessions
        });
      });
    });
  }
};
