// Part 1: Set up the helper functions:
// 1. Implement two filter functions (which should return either true or false):
//      * filterClassFull: to filter out the closed courses (if applicable)
//      * filterTermMatched: to only match courses relevant to the search term
// 2. Implement the dataToHTML function, which takes a course object as an
//    argument and returns an HTML string that represents the course.

// Part 2: Within the showData function, use the array's filter, map, join
//         methods, and any relevant DOM methods, to build the interface.
// 1. Use the array's built in "filter" method, which takes a filter
//    function as an argument and returns an array of objects that
//    match the criteria.
//          * Note that you can chain filter functions together.
// 2. Use the array's built in "map" method to generate an array of
//    HTML strings.
// 3. Join the array of strings on the empty string or new line character
//    to create one large HTML string.
// 4. Clear out the existing courses in the DOM and insert
//    the HTML string into the DOM.

const search = (ev) => {
  ev.preventDefault(); // overrides default button action

  // Get user's preferences:
  const searchTerm = document.querySelector("#search_term").value;
  const openOnly = document.querySelector("#is_open").checked;

  // Pass the user's preferences into the showData function
  showData(searchTerm, openOnly);
};

// Part 1.1a
const filterClassFull = ({ EnrollmentCurrent, EnrollmentMax }) => {
  return EnrollmentCurrent >= EnrollmentMax;
};

// Part 1.1b
const filterTermMatched = ({ Title }, searchTerm) => {
  return Title.toLowerCase().includes(searchTerm.toLowerCase());
};

// Part 1.2
const dataToHTML = (course) => {
  const seatsAvailable =
    course.EnrollmentCurrent >= course.EnrollmentMax
      ? 0
      : course.EnrollmentMax - course.EnrollmentCurrent;
  return `
        <section class="course">
            <h2>${course.Title}</h2>
            <p>
                <i class="fa-solid ${seatsAvailable > 0 ? "fa-circle-check" : "fa-circle-xmark"}"></i> 
                Open  &bull; ${course.CRN} &bull; Seats Available: ${seatsAvailable}
            </p>
            <p>
                ${course.Days} &bull; ${course.Location.FullLocation} &bull; ${course.Hours} credit hour(s)
            </p>
            <p><strong>${course.Instructors.map((instructor) => instructor.Name).join(", ")}</strong></p>
        </section>
`;
};

// Part 2
const showData = (searchTerm, openOnly) => {
  document.getElementById("course-container").innerHTML = "";

  let courses = data;
  if (openOnly) courses.filter((course) => !filterClassFull(course));

  courses = courses.filter((course) => filterTermMatched(course, searchTerm));

  document.getElementById("course-container").innerHTML = courses
    .map((course) => dataToHTML(course))
    .join("\n");

  if (courses.length == 0)
    document.getElementById("course-container").innerHTML = "No results found";
};
