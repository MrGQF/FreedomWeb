<template>
    <div class="review-page">
        <div class="review-header" @click="updateInfo">
            <div class="flag">{{ currentInfo ? currentInfo.Flag : '' }}</div>
            <div class="title">{{ currentInfo ? currentInfo.Title : '' }}</div>
            <a-tag v-for="(tagName, index) in (defaultSelectedTagNames ? defaultSelectedTagNames : [])" color="pink"
                :key="index" v-text="tagName"></a-tag>
            <a-button class="change-btn" type="primary" @click.stop="changeFiles">换一批</a-button>
        </div>

        <swiper :pagination="{ type: 'fraction' }" :navigation="true" :modules="modules" @navigation-next="next"
            @slideChange="getCurrentSlide" class="review-content">
            <swiper-slide v-for="(video, index) in ctnList" :key="index">
                <video ref="videoElements" class="review-video" style="margin: auto;" x5-video-player-type="h5"
                    x-webkit-airplay="true" webkit-playsinline="true" loop @click="play(video, index)">
                    <source :src="video.Src" type="video/mp4">
                </video>
            </swiper-slide>
        </swiper>

        <div class="review-footer">
            <a-button type="primary" @click="updateReviewFlag(2)">精品</a-button>
            <a-button type="primary" @click="updateReviewFlag(1)">合格</a-button>
            <a-button type="primary" @click="deleteFile">删除</a-button>
        </div>
    </div>

    <a-modal v-model:visible="modalVisible" title="修改信息">
        <template v-slot:default>
            <fileinfo :info="currentInfo" :defaultSelectedTagNames="defaultSelectedTagNames" :tags="tags"
                @close="handleModalCloseEvent"></fileinfo>
        </template>
        <template v-slot:footer>
        </template>
    </a-modal>
</template>
  
<script>
import fileinfo from './fileinfo.vue';
import api from './api'

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper';

export default {
    data() {
        return {
            modalVisible: false,
            ctnList: [],
            currentInfo: null,
            defaultSelectedTagNames: [],
            tags: [],
            activeIndex: 0,
            videoElement: [] // 视频元素数组
        }
    },
    components: {
        Swiper,
        SwiperSlide,
        fileinfo,
    },
    setup() {
        return {
            modules: [Pagination, Navigation],
        };
    },
    async mounted() {
        await this.getReviewFiles();
        this.currentInfo = this.ctnList[0];
        this.defaultSelectedTagNames = this.currentInfo ? this.currentInfo.Tags.map(tag => tag.Name) : [];
        await this.getTags();
        this.videoElement = document.getElementsByTagName('video')
    },
    methods: {
        async getReviewFiles() {
            try {
                const res = await api.apiGetReviewFiles();
                console.log("apiGetReviewFiles:", res);
                this.ctnList = res.Infos.map((info) => ({
                    Id: info.Id,
                    Title: info.Title,
                    Type: info.Type,
                    Src: `http://localhost:9999/api/raw/${info.Id}.mp4`,
                    Tags: info.Tags,
                    Flag: "待审核"
                }));
            } catch (error) {
                console.error(error);
            }
        },
        async getTags() {
            try {
                const res = await api.apiGetTags();
                console.log("getTags:", res);
                this.tags = res.Tags.map((tag) => ({
                    Id: tag.Id,
                    Name: tag.Name
                }));
            } catch (error) {
                console.error(error);
            }
        },
        async updateReviewFlag(flag) {
            try {
                const requestData = {
                    Id: this.currentInfo.Id,
                    Flag: flag
                };
                const res = await api.apiUpdateReviewFlag(requestData);
                console.log("审核结果：", res)
                if (flag === 1) {
                    this.currentInfo.Flag = "合格"
                } else if (flag === 2) {
                    this.currentInfo.Flag = "精品"
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteFile() {
            try {
                const requestData = {
                    Ids: [this.currentInfo.Id]
                };
                const res = await api.apiDeleteFile(requestData);
                console.log("删除结果：", res)
                this.currentInfo.Flag = "已删除"
            } catch (error) {
                console.error(error);
            }
        },
        handleModalCloseEvent(title, tagNames) {
            this.modalVisible = false
            this.currentInfo.Title = title
            this.currentInfo.Tags = tagNames ? tagNames.map((name) => ({ Id: 0, Name: name })) : [];
            this.defaultSelectedTagNames = this.currentInfo ? this.currentInfo.Tags.map(tag => tag.Name) : [];
        },
        getCurrentSlide(e) {
            this.activeIndex = e.activeIndex
            this.currentInfo = this.ctnList[this.activeIndex];
            this.defaultSelectedTagNames = this.currentInfo ? this.currentInfo.Tags.map(tag => tag.Name) : [];
            console.log("currentInfo:", this.currentInfo);

            this.play(this.index)
        },
        openPictureInPicture(index) {
            const video = document.getElementById("video" + index);
            video.requestPictureInPicture();
        },
        async changeFiles() {
            location.reload();
        },
        updateInfo() {
            this.modalVisible = true;
        },
        next(e) {
        },
        play(video, index) {
            const videoElement = this.videoElement
            if (videoElement && videoElement.length > 0) {
                for (let i = 0; i < videoElement.length; i++) {
                    if (i === index) {
                        this.videoElement[i].play()
                    } else {
                        this.videoElement[i].pause()
                    }
                }
            }
        }
    }
};
</script>
  
<style scoped>
.review-page {
    height: 100%;
    width: 100%;
    position: relative;
    max-width: 1024px;
}

.review-header {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 100;
}

.title {
    color: white;
    font-size: 1.2rem;
}

.flag {
    color: black;
    font-size: 1.5rem;
}

.change-btn {
    position: absolute;
    right: 0;
    top: 0;
}

.review-content {
    height: 100%;
    width: 100%;
}

.review-video {
    height: 100%;
    width: 100%;
}

.review-footer {
    display: flex;
    justify-content: stretch;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
}

.review-footer>button {
    flex-grow: 1;
}

.review-footer>button+button {
    margin-left: 2px;
}
</style>
  