<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    学生管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    学生管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="学生姓名"></el-table-column>
                <el-table-column label="成绩">
                    <template slot-scope="scope">{{scope.row.grade}}</template>
                </el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{scope.row.isDelete}}</template>
                </el-table-column>

                <el-table-column prop="createDate" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    layout="sizes, total, prev, pager, next"
                    :page-sizes="[8, 20, 30, 100]"
                    :page-size.sync="query.pageSize"
                    :current-page.sync="query.pageIndex"
                    @current-change="(val) => { fetchData() }"
                    @size-change="(val) => { fetchData() }"
                    :total="pageTotal"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item
                    label="学生姓名"
                    prop="name"
                    :rules="[
                { required: true, message: '必填项', trigger: 'blur' }
                ]"
                >
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item
                    label="年龄"
                    prop="age"
                    :rules="[
                { required: true, message: '必填项', trigger: 'blur' }
                ]"
                >
                    <el-input v-model="form.age"></el-input>
                </el-form-item>
                <el-form-item
                    label="成绩"
                    prop="grade"
                    :rules="[
                { required: true, message: '必填项', trigger: 'blur' }
                ]"
                >
                    <el-input v-model="form.grade"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { queryList, CreateOrUpdate } from '../../../api/SystemManage/student';
export default {
    name: 'basetable',
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            query: {
                pageIndex: 1,
                pageSize: 7
            },
            queryParam: { pageSize: 7 },
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                name: '',
                age: '',
                grade: ''
            }
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        fetchData() {
            queryList(this.query).then(res => {
                console.log(res);
                this.tableData = res.response.data;
                this.pageTotal = res.response.dataCount;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.queryParam = Object.assign(this.queryParam, this.query)
            this.fetchData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        handleAdd() {
            this.form.name = '';
            this.form.age = '';
            this.grade = '';
            this.editVisible = true;
        },
        // 保存编辑
        save() {
            this.editVisible = false;
            this.$refs.form.validate(valid => {
                if (valid) {
                    CreateOrUpdate(this.form).then(response => {
                        if (response.success) {
                            this.$message({
                                message: '提交成功！',
                                type: 'success'
                            });
                            this.fetchData();
                        } else {
                            this.$message({
                                message: response.msg,
                                type: 'error'
                            });
                        }
                    });
                }
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
