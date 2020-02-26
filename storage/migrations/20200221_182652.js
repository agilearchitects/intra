"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// tslint:disable-next-line: class-name
var _20200221_182652 = /** @class */ (function () {
    function _20200221_182652() {
    }
    _20200221_182652.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("CREATE TABLE \"banned_token_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"token\" varchar NOT NULL)")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"customer_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL)")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"project_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, \"rate\" decimal, \"priceBudget\" decimal, \"hoursBudget\" decimal, \"start\" date, \"end\" date, \"customerId\" integer NOT NULL)")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"tag_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL)")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"time_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"from\" datetime NOT NULL, \"to\" datetime, \"comment\" varchar, \"rate\" decimal, \"userId\" integer NOT NULL, \"taskId\" integer NOT NULL)")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"task_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, \"rate\" decimal, \"priceBudget\" decimal, \"hoursBudget\" decimal, \"projectId\" integer NOT NULL)")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"task_user_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"rate\" decimal, \"taskId\" integer NOT NULL, \"userId\" integer NOT NULL)")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"email\" varchar NOT NULL, \"password\" varchar NOT NULL, \"activated\" datetime, \"banned\" datetime)")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"group_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL)")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"claim_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, CONSTRAINT \"UQ_82c3a48e8e295f1c16714046dba\" UNIQUE (\"name\"))")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"resource_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"filename\" varchar NOT NULL, \"title\" varchar NOT NULL, CONSTRAINT \"UQ_e86af3c5bcb588f570dba0b854f\" UNIQUE (\"filename\"))")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"text_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, \"content\" varchar NOT NULL, CONSTRAINT \"UQ_114ffb586dc3da0a73116d6cf2e\" UNIQUE (\"name\"))")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"token_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"token\" varchar NOT NULL, \"type\" varchar NOT NULL, \"expires\" datetime NOT NULL)")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"time_entity_tags_tag_entity\" (\"timeEntityId\" integer NOT NULL, \"tagEntityId\" integer NOT NULL, PRIMARY KEY (\"timeEntityId\", \"tagEntityId\"))")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_49123545365a2a4225f2228d78\" ON \"time_entity_tags_tag_entity\" (\"timeEntityId\") ")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_2e67202babda3ef0afe097ffb4\" ON \"time_entity_tags_tag_entity\" (\"tagEntityId\") ")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_entity_claims_claim_entity\" (\"userEntityId\" integer NOT NULL, \"claimEntityId\" integer NOT NULL, PRIMARY KEY (\"userEntityId\", \"claimEntityId\"))")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_eb9ac7890ca477e2cc6edbbb10\" ON \"user_entity_claims_claim_entity\" (\"userEntityId\") ")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_dead7734281173079d566baafa\" ON \"user_entity_claims_claim_entity\" (\"claimEntityId\") ")];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"group_entity_users_user_entity\" (\"groupEntityId\" integer NOT NULL, \"userEntityId\" integer NOT NULL, PRIMARY KEY (\"groupEntityId\", \"userEntityId\"))")];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_8facb9a9f0c78b9158f4a77b00\" ON \"group_entity_users_user_entity\" (\"groupEntityId\") ")];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_c5ebd87a1a73c88ee35e336f75\" ON \"group_entity_users_user_entity\" (\"userEntityId\") ")];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"group_entity_claims_claim_entity\" (\"groupEntityId\" integer NOT NULL, \"claimEntityId\" integer NOT NULL, PRIMARY KEY (\"groupEntityId\", \"claimEntityId\"))")];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_fd5b8a69362aff0674fd6a6d0b\" ON \"group_entity_claims_claim_entity\" (\"groupEntityId\") ")];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_74371961e955d253894acf5cb0\" ON \"group_entity_claims_claim_entity\" (\"claimEntityId\") ")];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_project_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, \"rate\" decimal, \"priceBudget\" decimal, \"hoursBudget\" decimal, \"start\" date, \"end\" date, \"customerId\" integer NOT NULL, CONSTRAINT \"FK_6a519c02fd839683f7cb1328e73\" FOREIGN KEY (\"customerId\") REFERENCES \"customer_entity\" (\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION)")];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_project_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"start\", \"end\", \"customerId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"start\", \"end\", \"customerId\" FROM \"project_entity\"")];
                    case 27:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"project_entity\"")];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_project_entity\" RENAME TO \"project_entity\"")];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_time_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"from\" datetime NOT NULL, \"to\" datetime, \"comment\" varchar, \"rate\" decimal, \"userId\" integer NOT NULL, \"taskId\" integer NOT NULL, CONSTRAINT \"FK_39f46e32645cd96111b63b1d25b\" FOREIGN KEY (\"userId\") REFERENCES \"user_entity\" (\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT \"FK_ba2d99b53d97f451a919ca31c36\" FOREIGN KEY (\"taskId\") REFERENCES \"task_entity\" (\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION)")];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_time_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"from\", \"to\", \"comment\", \"rate\", \"userId\", \"taskId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"from\", \"to\", \"comment\", \"rate\", \"userId\", \"taskId\" FROM \"time_entity\"")];
                    case 31:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"time_entity\"")];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_time_entity\" RENAME TO \"time_entity\"")];
                    case 33:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_task_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, \"rate\" decimal, \"priceBudget\" decimal, \"hoursBudget\" decimal, \"projectId\" integer NOT NULL, CONSTRAINT \"FK_059bf296d2b45a7c930faa15d7f\" FOREIGN KEY (\"projectId\") REFERENCES \"project_entity\" (\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION)")];
                    case 34:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_task_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"projectId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"projectId\" FROM \"task_entity\"")];
                    case 35:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"task_entity\"")];
                    case 36:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_task_entity\" RENAME TO \"task_entity\"")];
                    case 37:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_task_user_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"rate\" decimal, \"taskId\" integer NOT NULL, \"userId\" integer NOT NULL, CONSTRAINT \"FK_f2fdb0351ecf4d6fec2a4216970\" FOREIGN KEY (\"taskId\") REFERENCES \"task_entity\" (\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT \"FK_03cdb57fcc020dcd2cbcb13d7d9\" FOREIGN KEY (\"userId\") REFERENCES \"user_entity\" (\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION)")];
                    case 38:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_task_user_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"rate\", \"taskId\", \"userId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"rate\", \"taskId\", \"userId\" FROM \"task_user_entity\"")];
                    case 39:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"task_user_entity\"")];
                    case 40:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_task_user_entity\" RENAME TO \"task_user_entity\"")];
                    case 41:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_49123545365a2a4225f2228d78\"")];
                    case 42:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_2e67202babda3ef0afe097ffb4\"")];
                    case 43:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_time_entity_tags_tag_entity\" (\"timeEntityId\" integer NOT NULL, \"tagEntityId\" integer NOT NULL, CONSTRAINT \"FK_49123545365a2a4225f2228d78c\" FOREIGN KEY (\"timeEntityId\") REFERENCES \"time_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT \"FK_2e67202babda3ef0afe097ffb45\" FOREIGN KEY (\"tagEntityId\") REFERENCES \"tag_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY (\"timeEntityId\", \"tagEntityId\"))")];
                    case 44:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_time_entity_tags_tag_entity\"(\"timeEntityId\", \"tagEntityId\") SELECT \"timeEntityId\", \"tagEntityId\" FROM \"time_entity_tags_tag_entity\"")];
                    case 45:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"time_entity_tags_tag_entity\"")];
                    case 46:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_time_entity_tags_tag_entity\" RENAME TO \"time_entity_tags_tag_entity\"")];
                    case 47:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_49123545365a2a4225f2228d78\" ON \"time_entity_tags_tag_entity\" (\"timeEntityId\") ")];
                    case 48:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_2e67202babda3ef0afe097ffb4\" ON \"time_entity_tags_tag_entity\" (\"tagEntityId\") ")];
                    case 49:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_eb9ac7890ca477e2cc6edbbb10\"")];
                    case 50:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_dead7734281173079d566baafa\"")];
                    case 51:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_user_entity_claims_claim_entity\" (\"userEntityId\" integer NOT NULL, \"claimEntityId\" integer NOT NULL, CONSTRAINT \"FK_eb9ac7890ca477e2cc6edbbb10d\" FOREIGN KEY (\"userEntityId\") REFERENCES \"user_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT \"FK_dead7734281173079d566baafac\" FOREIGN KEY (\"claimEntityId\") REFERENCES \"claim_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY (\"userEntityId\", \"claimEntityId\"))")];
                    case 52:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_user_entity_claims_claim_entity\"(\"userEntityId\", \"claimEntityId\") SELECT \"userEntityId\", \"claimEntityId\" FROM \"user_entity_claims_claim_entity\"")];
                    case 53:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_entity_claims_claim_entity\"")];
                    case 54:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_user_entity_claims_claim_entity\" RENAME TO \"user_entity_claims_claim_entity\"")];
                    case 55:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_eb9ac7890ca477e2cc6edbbb10\" ON \"user_entity_claims_claim_entity\" (\"userEntityId\") ")];
                    case 56:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_dead7734281173079d566baafa\" ON \"user_entity_claims_claim_entity\" (\"claimEntityId\") ")];
                    case 57:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_8facb9a9f0c78b9158f4a77b00\"")];
                    case 58:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_c5ebd87a1a73c88ee35e336f75\"")];
                    case 59:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_group_entity_users_user_entity\" (\"groupEntityId\" integer NOT NULL, \"userEntityId\" integer NOT NULL, CONSTRAINT \"FK_8facb9a9f0c78b9158f4a77b00f\" FOREIGN KEY (\"groupEntityId\") REFERENCES \"group_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT \"FK_c5ebd87a1a73c88ee35e336f758\" FOREIGN KEY (\"userEntityId\") REFERENCES \"user_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY (\"groupEntityId\", \"userEntityId\"))")];
                    case 60:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_group_entity_users_user_entity\"(\"groupEntityId\", \"userEntityId\") SELECT \"groupEntityId\", \"userEntityId\" FROM \"group_entity_users_user_entity\"")];
                    case 61:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"group_entity_users_user_entity\"")];
                    case 62:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_group_entity_users_user_entity\" RENAME TO \"group_entity_users_user_entity\"")];
                    case 63:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_8facb9a9f0c78b9158f4a77b00\" ON \"group_entity_users_user_entity\" (\"groupEntityId\") ")];
                    case 64:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_c5ebd87a1a73c88ee35e336f75\" ON \"group_entity_users_user_entity\" (\"userEntityId\") ")];
                    case 65:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_fd5b8a69362aff0674fd6a6d0b\"")];
                    case 66:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_74371961e955d253894acf5cb0\"")];
                    case 67:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"temporary_group_entity_claims_claim_entity\" (\"groupEntityId\" integer NOT NULL, \"claimEntityId\" integer NOT NULL, CONSTRAINT \"FK_fd5b8a69362aff0674fd6a6d0bf\" FOREIGN KEY (\"groupEntityId\") REFERENCES \"group_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT \"FK_74371961e955d253894acf5cb0f\" FOREIGN KEY (\"claimEntityId\") REFERENCES \"claim_entity\" (\"id\") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY (\"groupEntityId\", \"claimEntityId\"))")];
                    case 68:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"temporary_group_entity_claims_claim_entity\"(\"groupEntityId\", \"claimEntityId\") SELECT \"groupEntityId\", \"claimEntityId\" FROM \"group_entity_claims_claim_entity\"")];
                    case 69:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"group_entity_claims_claim_entity\"")];
                    case 70:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"temporary_group_entity_claims_claim_entity\" RENAME TO \"group_entity_claims_claim_entity\"")];
                    case 71:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_fd5b8a69362aff0674fd6a6d0b\" ON \"group_entity_claims_claim_entity\" (\"groupEntityId\") ")];
                    case 72:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_74371961e955d253894acf5cb0\" ON \"group_entity_claims_claim_entity\" (\"claimEntityId\") ")];
                    case 73:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    _20200221_182652.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_74371961e955d253894acf5cb0\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_fd5b8a69362aff0674fd6a6d0b\"")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"group_entity_claims_claim_entity\" RENAME TO \"temporary_group_entity_claims_claim_entity\"")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"group_entity_claims_claim_entity\" (\"groupEntityId\" integer NOT NULL, \"claimEntityId\" integer NOT NULL, PRIMARY KEY (\"groupEntityId\", \"claimEntityId\"))")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"group_entity_claims_claim_entity\"(\"groupEntityId\", \"claimEntityId\") SELECT \"groupEntityId\", \"claimEntityId\" FROM \"temporary_group_entity_claims_claim_entity\"")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_group_entity_claims_claim_entity\"")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_74371961e955d253894acf5cb0\" ON \"group_entity_claims_claim_entity\" (\"claimEntityId\") ")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_fd5b8a69362aff0674fd6a6d0b\" ON \"group_entity_claims_claim_entity\" (\"groupEntityId\") ")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_c5ebd87a1a73c88ee35e336f75\"")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_8facb9a9f0c78b9158f4a77b00\"")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"group_entity_users_user_entity\" RENAME TO \"temporary_group_entity_users_user_entity\"")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"group_entity_users_user_entity\" (\"groupEntityId\" integer NOT NULL, \"userEntityId\" integer NOT NULL, PRIMARY KEY (\"groupEntityId\", \"userEntityId\"))")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"group_entity_users_user_entity\"(\"groupEntityId\", \"userEntityId\") SELECT \"groupEntityId\", \"userEntityId\" FROM \"temporary_group_entity_users_user_entity\"")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_group_entity_users_user_entity\"")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_c5ebd87a1a73c88ee35e336f75\" ON \"group_entity_users_user_entity\" (\"userEntityId\") ")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_8facb9a9f0c78b9158f4a77b00\" ON \"group_entity_users_user_entity\" (\"groupEntityId\") ")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_dead7734281173079d566baafa\"")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_eb9ac7890ca477e2cc6edbbb10\"")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_entity_claims_claim_entity\" RENAME TO \"temporary_user_entity_claims_claim_entity\"")];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_entity_claims_claim_entity\" (\"userEntityId\" integer NOT NULL, \"claimEntityId\" integer NOT NULL, PRIMARY KEY (\"userEntityId\", \"claimEntityId\"))")];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"user_entity_claims_claim_entity\"(\"userEntityId\", \"claimEntityId\") SELECT \"userEntityId\", \"claimEntityId\" FROM \"temporary_user_entity_claims_claim_entity\"")];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_user_entity_claims_claim_entity\"")];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_dead7734281173079d566baafa\" ON \"user_entity_claims_claim_entity\" (\"claimEntityId\") ")];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_eb9ac7890ca477e2cc6edbbb10\" ON \"user_entity_claims_claim_entity\" (\"userEntityId\") ")];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_2e67202babda3ef0afe097ffb4\"")];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_49123545365a2a4225f2228d78\"")];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"time_entity_tags_tag_entity\" RENAME TO \"temporary_time_entity_tags_tag_entity\"")];
                    case 27:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"time_entity_tags_tag_entity\" (\"timeEntityId\" integer NOT NULL, \"tagEntityId\" integer NOT NULL, PRIMARY KEY (\"timeEntityId\", \"tagEntityId\"))")];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"time_entity_tags_tag_entity\"(\"timeEntityId\", \"tagEntityId\") SELECT \"timeEntityId\", \"tagEntityId\" FROM \"temporary_time_entity_tags_tag_entity\"")];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_time_entity_tags_tag_entity\"")];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_2e67202babda3ef0afe097ffb4\" ON \"time_entity_tags_tag_entity\" (\"tagEntityId\") ")];
                    case 31:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_49123545365a2a4225f2228d78\" ON \"time_entity_tags_tag_entity\" (\"timeEntityId\") ")];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"task_user_entity\" RENAME TO \"temporary_task_user_entity\"")];
                    case 33:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"task_user_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"rate\" decimal, \"taskId\" integer NOT NULL, \"userId\" integer NOT NULL)")];
                    case 34:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"task_user_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"rate\", \"taskId\", \"userId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"rate\", \"taskId\", \"userId\" FROM \"temporary_task_user_entity\"")];
                    case 35:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_task_user_entity\"")];
                    case 36:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"task_entity\" RENAME TO \"temporary_task_entity\"")];
                    case 37:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"task_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, \"rate\" decimal, \"priceBudget\" decimal, \"hoursBudget\" decimal, \"projectId\" integer NOT NULL)")];
                    case 38:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"task_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"projectId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"projectId\" FROM \"temporary_task_entity\"")];
                    case 39:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_task_entity\"")];
                    case 40:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"time_entity\" RENAME TO \"temporary_time_entity\"")];
                    case 41:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"time_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"from\" datetime NOT NULL, \"to\" datetime, \"comment\" varchar, \"rate\" decimal, \"userId\" integer NOT NULL, \"taskId\" integer NOT NULL)")];
                    case 42:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"time_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"from\", \"to\", \"comment\", \"rate\", \"userId\", \"taskId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"from\", \"to\", \"comment\", \"rate\", \"userId\", \"taskId\" FROM \"temporary_time_entity\"")];
                    case 43:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_time_entity\"")];
                    case 44:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"project_entity\" RENAME TO \"temporary_project_entity\"")];
                    case 45:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"project_entity\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedAt\" datetime NOT NULL DEFAULT (datetime('now')), \"name\" varchar NOT NULL, \"rate\" decimal, \"priceBudget\" decimal, \"hoursBudget\" decimal, \"start\" date, \"end\" date, \"customerId\" integer NOT NULL)")];
                    case 46:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("INSERT INTO \"project_entity\"(\"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"start\", \"end\", \"customerId\") SELECT \"id\", \"createdAt\", \"updatedAt\", \"name\", \"rate\", \"priceBudget\", \"hoursBudget\", \"start\", \"end\", \"customerId\" FROM \"temporary_project_entity\"")];
                    case 47:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"temporary_project_entity\"")];
                    case 48:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_74371961e955d253894acf5cb0\"")];
                    case 49:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_fd5b8a69362aff0674fd6a6d0b\"")];
                    case 50:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"group_entity_claims_claim_entity\"")];
                    case 51:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_c5ebd87a1a73c88ee35e336f75\"")];
                    case 52:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_8facb9a9f0c78b9158f4a77b00\"")];
                    case 53:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"group_entity_users_user_entity\"")];
                    case 54:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_dead7734281173079d566baafa\"")];
                    case 55:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_eb9ac7890ca477e2cc6edbbb10\"")];
                    case 56:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_entity_claims_claim_entity\"")];
                    case 57:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_2e67202babda3ef0afe097ffb4\"")];
                    case 58:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"IDX_49123545365a2a4225f2228d78\"")];
                    case 59:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"time_entity_tags_tag_entity\"")];
                    case 60:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"token_entity\"")];
                    case 61:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"text_entity\"")];
                    case 62:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"resource_entity\"")];
                    case 63:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"claim_entity\"")];
                    case 64:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"group_entity\"")];
                    case 65:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_entity\"")];
                    case 66:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"task_user_entity\"")];
                    case 67:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"task_entity\"")];
                    case 68:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"time_entity\"")];
                    case 69:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"tag_entity\"")];
                    case 70:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"project_entity\"")];
                    case 71:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"customer_entity\"")];
                    case 72:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"banned_token_entity\"")];
                    case 73:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return _20200221_182652;
}());
exports._20200221_182652 = _20200221_182652;
