import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input, { TextArea } from "../components/ui/Input";
import { changePassword, deleteAccount, updateProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ui/Modal";

export default function EditProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
  });
  const [avatar, setAvatar] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("username", form.username);
      data.append("bio", form.bio);
      if (avatar) data.append("image", avatar);
      await updateProfile(data);
      await refreshUser();
      toast.success("Profile updated");
      navigate("/app/profile");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(passwords);
      toast.success("Password changed");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      logout();
      toast.success("Account deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="page-title">Edit profile</h1>

      <form onSubmit={saveProfile} className="card space-y-4 rounded-2xl p-4 sm:p-6">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextArea
          label="Bio"
          maxLength={160}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <label className="block text-sm">
          <span className="font-medium">Avatar</span>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          />
        </label>
        <Button loading={loading} type="submit">
          Save profile
        </Button>
      </form>

      <form onSubmit={savePassword} className="card space-y-4 rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <Input
          label="Current password"
          type="password"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
        />
        <Input
          label="New password"
          type="password"
          minLength={8}
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />
        <Button loading={loading} type="submit" variant="secondary">
          Update password
        </Button>
      </form>

      <div className="card rounded-2xl border border-rose-500/20 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-rose-500">Danger zone</h2>
        <p className="mt-1 text-sm text-muted">
          Permanently delete your account and data.
        </p>
        <Button
          className="mt-4"
          variant="danger"
          onClick={() => setConfirmDelete(true)}
        >
          Delete account
        </Button>
      </div>

      <Modal
        open={confirmDelete}
        title="Delete account?"
        onClose={() => setConfirmDelete(false)}
      >
        <p className="text-sm text-muted">This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={loading} onClick={removeAccount}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
