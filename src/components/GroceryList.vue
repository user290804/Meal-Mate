<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { Delete, Edit, Plus, ShoppingCart } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

const store = useStore();

// Reactive data
const listName = ref("");
const newItem = ref({ name: "", quantity: 1, purchased: false });
const showAddItemForm = ref(false);
const editingList = ref(null);
const isCreatingNew = ref(false);
const hasUnsavedChanges = ref(false);
const originalItems = ref([]);

// Computed properties
const groceryLists = computed(() => store.getters["grocery/sortedLists"] || []);
const currentList = computed(() => store.state.grocery?.currentList || null);
const loading = computed(() => store.state.grocery.loading || false);

// Form validation
const listNameError = ref("");
const itemNameError = ref("");

// Initialize component
onMounted(async () => {
  await store.dispatch("grocery/fetchGroceryLists");
});

// Watch for changes in current list to track unsaved changes
watch(
  currentList,
  (newList, oldList) => {
    if (newList && newList.items) {
      originalItems.value = JSON.parse(JSON.stringify(newList.items));
    }
  },
  { immediate: true }
);

// Validation functions
const validateListName = () => {
  if (!listName.value.trim()) {
    listNameError.value = "List name is required";
    return false;
  }
  listNameError.value = "";
  return true;
};

const validateItemName = () => {
  if (!newItem.value.name.trim()) {
    itemNameError.value = "Item name is required";
    return false;
  }
  itemNameError.value = "";
  return true;
};

// List management functions
const createNewList = async () => {
  if (!validateListName()) return;

  try {
    const newList = await store.dispatch("grocery/createGroceryList", {
      name: listName.value.trim(),
      items: [],
    });
    ElMessage.success("Grocery list created successfully!");
    listName.value = "";
    isCreatingNew.value = false;
    // Select the new list and show add item form
    selectList(newList);
    showAddItemForm.value = true;
  } catch (error) {
    ElMessage.error("Failed to create list: " + error.message);
  }
};

const selectList = (list) => {
  store.commit("grocery/SET_CURRENT_LIST", list);
  editingList.value = null;
  showAddItemForm.value = false;
};

const deleteList = async (list) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the entire list "${list.name}"? This action cannot be undone.`,
      "Delete Grocery List",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
        confirmButtonClass: "el-button--danger",
      }
    );

    await store.dispatch("grocery/deleteGroceryList", list.id);
    ElMessage.success("List deleted successfully!");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("Failed to delete list: " + error.message);
    }
  }
};

// Item management functions
const addItem = async () => {
  if (!validateItemName() || !currentList.value) return;

  try {
    await store.dispatch("grocery/addItemToList", {
      listId: currentList.value.id,
      item: {
        name: newItem.value.name.trim(),
        quantity: newItem.value.quantity,
        purchased: false,
      },
    });
    newItem.value = { name: "", quantity: 1, purchased: false };
    showAddItemForm.value = false;
    ElMessage.success("Item added successfully!");
  } catch (error) {
    ElMessage.error("Failed to add item: " + error.message);
  }
};

const toggleItem = async (item) => {
  if (!currentList.value) return;

  const updatedItems = currentList.value.items.map((i) =>
    i.id === item.id ? { ...i, purchased: !i.purchased } : i
  );

  try {
    await store.dispatch("grocery/updateGroceryList", {
      id: currentList.value.id,
      updates: { items: updatedItems },
    });
  } catch (error) {
    ElMessage.error("Failed to update item: " + error.message);
  }
};

const removeItem = async (itemId) => {
  if (!currentList.value) return;

  try {
    await store.dispatch("grocery/removeItemFromList", {
      listId: currentList.value.id,
      itemId,
    });
    ElMessage.success("Item removed successfully!");
  } catch (error) {
    ElMessage.error("Failed to remove item: " + error.message);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const saveCurrentList = async () => {
  if (!currentList.value) return;
  try {
    await store.dispatch("grocery/updateGroceryList", {
      id: currentList.value.id,
      updates: { items: currentList.value.items },
    });
    ElMessage.success("List saved!");
  } catch (error) {
    ElMessage.error("Failed to save list: " + error.message);
  }
};
</script>

<template>
  <div class="grocery-container">
    <div class="grocery-card">
      <h1 class="grocery-title">
        <el-icon><ShoppingCart /></el-icon>
        Grocery Lists
      </h1>

      <!-- Create New List Section -->
      <div class="section create-list-section">
        <el-button
          v-if="!isCreatingNew"
          type="primary"
          @click="isCreatingNew = true"
          class="create-btn"
        >
          <el-icon><Plus /></el-icon>
          Create New List
        </el-button>

        <div v-if="isCreatingNew" class="create-form">
          <el-input
            v-model="listName"
            placeholder="Enter list name"
            size="large"
            :class="{ error: listNameError }"
            @blur="validateListName"
          />
          <div v-if="listNameError" class="error-message">
            {{ listNameError }}
          </div>
          <div class="form-actions">
            <el-button type="primary" @click="createNewList" :loading="loading">
              Create List
            </el-button>
            <el-button @click="isCreatingNew = false">Cancel</el-button>
          </div>
        </div>
      </div>

      <!-- Previous Lists Section -->
      <div
        v-if="groceryLists && groceryLists.length > 0"
        class="section previous-lists"
      >
        <h2>Previous Lists</h2>
        <div class="lists-grid">
          <div
            v-for="list in groceryLists"
            :key="list.id"
            class="list-card"
            :class="{ active: currentList?.id === list.id }"
            @click="selectList(list)"
          >
            <h3>{{ list.name }}</h3>
            <p class="list-date">{{ formatDate(list.createdAt) }}</p>
            <p class="list-items-count">{{ list.items?.length || 0 }} items</p>
            <div class="list-actions">
              <el-button
                type="danger"
                size="small"
                @click.stop="deleteList(list)"
                :icon="Delete"
                circle
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Current List Section -->
      <div v-if="currentList" class="section current-list">
        <h2>{{ currentList.name }}</h2>

        <!-- Add Item Form -->
        <div class="add-item-section">
          <el-button
            v-if="!showAddItemForm"
            @click="showAddItemForm = true"
            class="add-item-btn"
          >
            <el-icon><Plus /></el-icon>
            Add Item
          </el-button>

          <div v-if="showAddItemForm" class="add-item-form">
            <el-input
              v-model="newItem.name"
              placeholder="Item name"
              size="large"
              :class="{ error: itemNameError }"
              @blur="validateItemName"
            />
            <el-input-number
              v-model="newItem.quantity"
              :min="1"
              :max="100"
              size="large"
            />
            <div class="form-actions">
              <el-button type="primary" @click="addItem" :loading="loading">
                Add
              </el-button>
              <el-button @click="showAddItemForm = false">Cancel</el-button>
            </div>
            <div v-if="itemNameError" class="error-message">
              {{ itemNameError }}
            </div>
          </div>
        </div>
        <!-- Items List -->
        <div
          v-if="currentList.items && currentList.items.length > 0"
          class="items-list"
        >
          <div
            v-for="item in currentList.items"
            :key="item.id"
            class="item-row"
            :class="{ purchased: item.purchased }"
          >
            <el-checkbox :checked="item.purchased" @change="toggleItem(item)">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-quantity">x{{ item.quantity }}</span>
            </el-checkbox>
            <el-button
              type="danger"
              size="small"
              @click="removeItem(item.id)"
              :icon="Delete"
              circle
            />
          </div>
        </div>

        <!-- Items List (shown when there are items) -->
        <div
          v-if="currentList.items && currentList.items.length > 0"
          class="items-list"
        >
        </div>
        <!-- Empty State (shown when there are no items) -->
        <div v-else class="empty-state">
          <p>No items in this list yet. Add some items to get started!</p>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && groceryLists.length === 0"
        class="empty-state"
      >
        <el-icon size="48"><ShoppingCart /></el-icon>
        <p style="color: rgb(182, 177, 177)">
          No grocery lists yet. Create your first list to get started!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grocery-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-size: cover;
  margin-top: 5.7rem;
}

.grocery-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(80, 44, 74, 0.12);
}

.grocery-title {
  font-size: 2rem;
  font-weight: 600;
  color: #484a5a;
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.section {
  margin-bottom: 2rem;
}

.create-list-section {
  text-align: center;
}

.create-btn {
  background-color: #484a5a !important;
  border: none;
  color: #fff;
  font-weight: 600;
}

.create-btn:hover {
  background-color: #989ec4 !important;
  color: white;
}

.create-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-actions {
  margin-top: 0.3rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.previous-lists h2 {
  color: #484a5a;
  margin-bottom: 1rem;
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.list-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.list-card.active {
  border-color: #801336;
  background-color: #f0e6f7;
}

.list-card h3 {
  margin: 0 0 0.5rem 0;
  color: #484a5a;
  font-size: 1.1rem;
}

.list-date {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
}

.list-items-count {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.list-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.current-list h2 {
  color: #484a5a;
  margin-bottom: 1.5rem;
}

.save-list-actions {
  margin-bottom: 1rem;
}

.add-item-section {
  margin-bottom: 1.5rem;
}

.add-item-btn {
  background-color: #484a5a !important;
  border: none;
  color: white;
  font-weight: 600;
}

.add-item-btn:hover {
  background-color: #989ec4 !important;
  color: white;
}

.add-item-form {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.add-item-form .el-input {
  flex: 1;
  min-width: 200px;
}

.items-list {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
}

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s;
}

.item-row:last-child {
  border-bottom: none;
}

.item-row:hover {
  background-color: #f8f9fa;
}

.item-row.purchased {
  background-color: #f8fff8;
}

.item-row.purchased .item-name {
  text-decoration: line-through;
  color: #6c757d;
}

.item-name {
  font-weight: 500;
  margin-right: 0.5rem;
}

.item-quantity {
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-state p {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-state .el-icon {
  margin-bottom: 1rem;
  color: #dee2e6;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

:deep(.el-checkbox__label) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 600px) {
  .grocery-card {
    padding: 1rem;
  }

  .lists-grid {
    grid-template-columns: 1fr;
  }

  .add-item-form {
    flex-direction: column;
  }
}
</style>
