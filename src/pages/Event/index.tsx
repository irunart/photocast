import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import * as _ from 'lodash-es'
import { Select } from 'antd'
import { Image } from 'antd-mobile'

import { getPhotographers } from "@/services/googleApis";
import { getEventPhotoGrapher } from './common'

import styles from './index.module.scss'

const Home = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { event } = useParams();

    const [photoGraphers, setPhotoGraphers] = useState([])
    const [grapher, setGrapher] = useState(null)

    if (!event) navigate('/home', { replace: true })


    // init 阶段
    useEffect(() => {
        if (!event) return;
        getPhotographers().then(res => {
            const grapherLists = getEventPhotoGrapher(res, event);
            setGrapher(grapherLists[0])
            setPhotoGraphers(grapherLists)
        })
    }, [])


    const handlePhotoGrapherChange = nextGrapher => {

        const i = _.find(photoGraphers, { value: nextGrapher })
        setGrapher(i)
        console.log(i)
    }


    return <div>
        <p>Select photographer below:</p>
        <Select className={styles.grapherOptions} onChange={handlePhotoGrapherChange} value={grapher?.value}>
            {photoGraphers.map(i => <Select.Option key={i.value} value={i.value} >
                <span>{i.label}</span>
            </Select.Option>)}
        </Select>
    </div>
}

export default Home;