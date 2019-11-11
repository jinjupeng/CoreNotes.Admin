<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>接口管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-form :inline="true" :model="queryParam" class="query-form-inline">
                    <el-form-item>
                        <el-input v-model="queryParam.name" clearable placeholder="请输入接口名"></el-input>
                    </el-form-item>
                    <!-- 用户名的启用/禁用状态查询 -->
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="linkUrl" label="接口地址" align="center"></el-table-column>
                <el-table-column prop="name" label="接口描述" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>

                <el-table-column prop="createBy" label="创建者" width sortable align="center"></el-table-column>
                <el-table-column prop="enabled" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.enabled ? 'success' : 'danger'"
                            disable-transitions
                        >{{scope.row.enabled ? "正常":"禁用"}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <!-- 用户名的启用/禁用按钮 -->
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

        <!--编辑界面-->
        <el-dialog
            title="编辑"
            :visible.sync="editFormVisible"
            v-model="editFormVisible"
            :close-on-click-modal="false"
        >
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="接口地址" prop="linkUrl">
                    <el-input v-model="editForm.linkUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口描述" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="enabled">
                    <el-select v-model="editForm.enabled" placeholder="请选择接口状态">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog
            title="新增"
            :visible.sync="addFormVisible"
            v-model="addFormVisible"
            :close-on-click-modal="false"
        >
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="接口地址" prop="linkUrl">
                    <el-input v-model="addForm.linkUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口描述" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="enabled">
                    <el-select v-model="addForm.enabled" placeholder="请选择接口状态">
                        <el-option label="激活" value="true"></el-option>
                        <el-option label="禁用" value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getModuleList, removeModule, batchRemoveModule, editModule, addModule } from '../../../api/SystemManage/module';
import util from '../../../utils/date';
import { utilsMixin } from '../../../mixin/utils';

export default {
    name: 'Module',
    mixins: [utilsMixin],
    components: {},
    data() {
        return {
            tableData: [],
            statusList: [],
            query: {
                pageIndex: 1,
                pageSize: 7
            },
            queryParam: { pageSize: 7, name: '' },
            pageTotal: 0,
            listLoading: false,
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editFormRules: {
                linkUrl: [{ required: true, message: '请输入接口地址', trigger: 'blur' }]
            },
            //编辑界面数据
            editForm: {
                id: 0,
                createBy: '',
                name: '', // 接口描述
                enabled: false
            },

            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                linkUrl: [{ required: true, message: '请输入接口地址', trigger: 'blur' }]
            },
            //新增界面数据
            addForm: {
                createBy: '',
                createId: '',
                name: '', // 接口描述
                enabled: true
            }
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            getModuleList(this.query).then(res => {
                // console.log(res);
                this.tableData = res.response.data;
                this.pageTotal = res.response.dataCount;
                this.listLoading = false;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.query = Object.assign(this.query, this.queryParam);
            this.fetchData();
        },
        //删除
        handleDelete(index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    removeModule(para).then(res => {
                        if (util.isEmt.format(res)) {
                            this.listLoading = false;
                            return;
                        }
                        this.listLoading = false;
                        //NProgress.done();
                        if (res.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        }

                        this.fetchData();
                    });
                })
                .catch(() => {});
        },
        //显示编辑界面
        handleEdit(index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            this.statusList = this.getEnumType('RoleStatus');
        },
        //显示新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                linkUrl: '',
                createBy: '',
                name: '',
                enabled: ''
            };
            this.statusList = this.getEnumType('RoleStatus');
        },
        //编辑
        editSubmit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.editForm);
                        editModule(para).then(res => {
                            if (util.isEmt.format(res)) {
                                this.editLoading = false;
                                return;
                            }
                            if (res.success) {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.fetchData();
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        });
                    });
                }
            });
        },
        //新增
        addSubmit() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        addModule(para).then(res => {
                            if (util.isEmt.format(res)) {
                                this.addLoading = false;
                                return;
                            }

                            if (res.success) {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.fetchData();
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        });
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
