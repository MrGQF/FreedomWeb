<template>
    <h2>文件管理</h2>
    <p>{{ msg }}</p>
    <hr />
    <div>
        <span>&nbsp;&nbsp;</span>
        <a-select show-search placeholder="Select a person" option-filter-prop="children" style="width: 200px"
            :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur" @change="handleChange">
            <a-select-option v-for="(value, index) in options" :value="value.id">{{ value.name }}</a-select-option>
        </a-select>     
        <span>&nbsp;&nbsp;&nbsp;</span>
        <a-button type="primary" @click="searchHandler">查询作者文件</a-button>
        <span>&nbsp;&nbsp;</span>
        <a-button type="danger" @click="deleteHandler">删除选中文件</a-button>
        <span>&nbsp;&nbsp;</span>
        <a-button type="danger">删除选中作者</a-button>
    </div>

    <div>
        <a-table :row-selection="rowSelection" :columns="columns" :data-source="data" />
    </div>
</template>

<script>
import request from "../utils/http"
export default {
    data() {
        return {
            data: [],
            columns: [],
            selectedRowKeys: [], // Check here to configure the default column
            options: [],
            msg: ""
        };
    },
    mounted() {
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
            },
            {
                title: 'Age',
                dataIndex: 'age',
            },
            {
                title: 'Address',
                dataIndex: 'address',
            },
        ];
        this.options = [{
            id: "1",
            name: "author1"
        }, {
            id: "2",
            name: "author2"
        }],
            request({
                url: '/v1/user/get?account=aegeanus1',
                method: 'get'
            }).then((res) => {
                alert('请求成功!');
                this.msg = res.data
            }).catch(function (error) {
                console.log(error);
                alert("请求失败", error)
            });
    },
    computed: {
        rowSelection() {
            const { selectedRowKeys } = this;
            return {
                selectedRowKeys,
                onChange: this.onSelectChange,
                hideDefaultSelections: true,
                selections: [
                    {
                        key: 'all-data',
                        text: 'Select All Data',
                        onSelect: () => {
                            this.selectedRowKeys = [...Array(46).keys()]; // 0...45
                        },
                    },
                    {
                        key: 'odd',
                        text: 'Select Odd Row',
                        onSelect: changableRowKeys => {
                            let newSelectedRowKeys = [];
                            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                                if (index % 2 !== 0) {
                                    return false;
                                }
                                return true;
                            });
                            this.selectedRowKeys = newSelectedRowKeys;
                        },
                    },
                    {
                        key: 'even',
                        text: 'Select Even Row',
                        onSelect: changableRowKeys => {
                            let newSelectedRowKeys = [];
                            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                                if (index % 2 !== 0) {
                                    return true;
                                }
                                return false;
                            });
                            this.selectedRowKeys = newSelectedRowKeys;
                        },
                    },
                ],
                onSelection: this.onSelection,
            };
        },
    },
    methods: {
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        handleChange(value) {
            console.log(`selected ${value}`);
        },
        handleBlur() {
            console.log('blur');
        },
        handleFocus() {
            console.log('focus');
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        searchHandler() {
            this.data.push({ key: 1, name: `Edward King 1`, age: 32, address: `London, Park Lane no.` });
            this.data.push({ key: 2, name: `Edward King 2`, age: 32, address: `London, Park Lane no.` });
        },
        deleteHandler() {
            this.data.pop()
        }
    },
};
</script>
  
  
  