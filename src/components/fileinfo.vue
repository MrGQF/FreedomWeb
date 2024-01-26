
<template>
    <a-form id="fileinfo" v-bind="formItemLayout">
        <a-form-item label="标识">
            <span>{{ info.Id }}</span>
        </a-form-item>

        <a-form-item label="标题" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-input placeholder="请输入标题" :value="info.Title" @input="info.Title = $event.target.value" />
        </a-form-item>

        <!--<a-form-item label="标记">
        <a-radio-group v-model="flagValue">
          <a-radio :value="1">合格</a-radio>
          <a-radio :value="2">精品</a-radio>
        </a-radio-group>
      </a-form-item>-->

        <a-form-item label="标签[多选]">
            <a-select :value="defaultSelectedTagNames" @update:value="defaultSelectedTagNames = $event" mode="multiple"
                style="width: 100%" placeholder="请选择视频标签">
                <a-select-option v-for="(tag, index) in tags" :value="tag.Name" :key="tag.Name"
                    :disabled="isTagOptionDisabled(tag)">
                    {{ tag.Name }}
                </a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item label="是否连续">
            <a-switch :checked="info.Type === 1" :disabled="true" />
        </a-form-item>

        <a-form-item label="  ">
            <a-button type="primary" @click="updateFileInfo">修改</a-button>
        </a-form-item>
    </a-form>
</template>
  
<script>
import api from './api'
export default {
    data() {
        return {
            formItemLayout: {
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
            },
        };
    },
    computed: {
        isTagSelectionDisabled() {
            return this.info.Type === 1;
        },
    },
    methods: {
        isTagOptionDisabled(tag) {
            if (this.info.Type === 1) {
                // 如果文件连续，禁用已选择的a-select-option标签
                return this.defaultSelectedTagNames.includes(tag.Name);
            }
            return false; // 文件非连续时不禁用任何选项
        },
        async updateFileInfo() {
            try {
                const requestData = {
                    Id: this.info.Id,
                    Title: this.info.Title,
                    TagNames: this.defaultSelectedTagNames,
                };
                const res = await api.apiUpdateFileInfo(requestData);
                console.log("更新文件信息结果：", res)
                this.$emit("close", requestData.Title, requestData.TagNames)                      
            } catch (error) {
                console.error(error);
            }
        }
    },
    props: ["info", "defaultSelectedTagNames", "tags"],
};
</script>
  
<style></style>
  