import fastifyPlugin from 'fastify-plugin'

// Register enums for supported clubs and courses within them
async function clubs (fastify, options) {

    /*
        We can create an endpoint where we can create a course/club. 
        I think this might be better since it doesn't force us to make a code change
        We can then load from the mongo DB here and decorate fastify with the courses
        so they can be accessed fast without

        Will need to make sure we decorate it with a refresh method so it can be called
        after register is called
    */
}

class Club {

    constructor(id) {
        this.id = id
        this.courses = []
    }

    withCourse(course) {
        this.courses.push(course)
        return this
    }
}

class Course {

    constructor(id) {
        this.id = id
    }
}

export default fastifyPlugin(clubs)