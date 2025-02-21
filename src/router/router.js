import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../view/Login.vue'
import SignUp from '../view/SignUp.vue'
import JobPost from '../view/JobPost.vue'
import JobPostUpdate from '../view/JobPostUpdate.vue'
import JobList from '../view/JobList.vue'
import JobDetail from '../view/JobDetail.vue'
import UseProfile from '../view/UseProfile.vue'

const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/signup',
        component: SignUp
    },
    {
        path: '/job-post',
        component: JobPost
    },
    {
        path: '/job-list',
        component: JobList
    },
    {
        path: '/job-detail/:id',
        component: JobDetail
    },
    {
        path: '/user-profile',
        component: UseProfile
    },
    {
        path: '/job-post-update/:id',
        component: JobPostUpdate
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router