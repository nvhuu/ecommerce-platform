# Hướng Dẫn Sử Dụng Docs UI Tracker

## 📍 Vị Trí Files

Tất cả tài liệu implementation cho UI (Web & CMS) được lưu tại:

```
/home/huu/.gemini/antigravity/scratch/ecommerce-platform/docs/ui/
```

### Files Chính

1. **`README.md`** - Progress tracker dashboard
2. **`implementation_plan.md`** - Kế hoạch chi tiết 5 phases
3. **`task.md`** - Module coverage breakdown

---

## 🎯 Cách Sử Dụng

### Bước 1: Xem Kế Hoạch Tổng Thể

```bash
cd docs/ui
cat implementation_plan.md
```

### Bước 2: Theo Dõi Progress

```bash
cat README.md
```

### Bước 3: Xem Task Chi Tiết

```bash
cat task.md
```

---

## ✅ Quy Trình Đánh Dấu Hoàn Thành

### Khi Bắt Đầu Task

1. **Mở file cần update** (README.md hoặc task.md)
2. **Tìm task** cần làm
3. **Đổi status:**
   ```markdown
   - [ ] Task name → - [/] Task name
   ```
4. **Commit:**
   ```bash
   git add docs/ui/
   git commit -m "chore(ui): start [task name]"
   ```

### Khi Hoàn Thành Task

1. **Mở file cần update**
2. **Đổi status:**
   ```markdown
   - [/] Task name → - [x] Task name
   ```
3. **Update progress %** (nếu có)
4. **Commit:**
   ```bash
   git add docs/ui/
   git commit -m "feat(ui): complete [task name]"
   ```

### Khi Hoàn Thành Phase

1. **Update phase status:**
   ```markdown
   **Status:** 🔴 Not Started → 🟢 Complete
   ```
2. **Update progress metrics**
3. **Add summary note** trong Notes section
4. **Commit:**
   ```bash
   git add docs/ui/
   git commit -m "feat(ui): complete Phase X - [summary]"
   ```

---

## 📊 Status Icons

- 🔴 **Not Started** - Chưa bắt đầu
- 🟡 **In Progress** - Đang làm
- 🟢 **Complete** - Hoàn thành
- ⚠️ **Blocked** - Bị chặn/cần hỗ trợ

---

## 📝 Example Workflow

### Scenario: Bắt đầu làm Wishlist

1. **Mở README.md**

   ```bash
   nano docs/ui/README.md
   ```

2. **Tìm và update:**

   ```markdown
   ### Phase 1: E-commerce Core

   **Status:** 🔴 Not Started → 🟡 In Progress

   - [ ] Wishlist functionality → - [/] Wishlist functionality
   ```

3. **Save và commit:**

   ```bash
   git add docs/ui/README.md
   git commit -m "chore(ui): start wishlist functionality"
   ```

4. **Làm việc...**

5. **Khi xong, update lại:**

   ```markdown
   - [/] Wishlist functionality → - [x] Wishlist functionality
   ```

6. **Commit hoàn thành:**

   ```bash
   git add docs/ui/README.md
   git commit -m "feat(ui): complete wishlist functionality

   - Add wishlist page /wishlist
   - Add add/remove from wishlist API calls
   - Add wishlist icon to product cards"
   ```

---

## 🔗 Quick Links

- [View Progress Tracker](./README.md)
- [View Full Implementation Plan](./implementation_plan.md)
- [View Task Breakdown](./task.md)

---

## 💡 Tips

1. **Commit thường xuyên** - Mỗi khi hoàn thành 1 task nhỏ
2. **Viết commit message rõ ràng** - Giúp theo dõi lịch sử
3. **Update progress %** - Giúp nhìn thấy tiến độ tổng thể
4. **Thêm notes** - Ghi lại quyết định quan trọng
5. **Review định kỳ** - Xem lại README.md mỗi tuần

---

**Created:** 2026-01-06  
**Last Updated:** 2026-01-06
