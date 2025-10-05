"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { data: userData, error: getUserError } =
        await supabase.auth.getUser();
      if (!isMounted) return;
      if (getUserError) {
        setError(getUserError.message);
        setLoading(false);
        return;
      }
      const user = userData.user;
      if (user) {
        const fullName =
          (user.user_metadata && (user.user_metadata.full_name as string)) ||
          "";
        setName(fullName);
        setEmail(user.email || "");
      }
      setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    if (updateError) {
      setError(updateError.message);
    } else {
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive mb-3">{error}</p>}
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src="https://i.pravatar.cc/150?u=a0480af53835adec"
                alt="avatar"
              />
              <AvatarFallback>
                {(name || email || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label>Name</Label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading || saving}
                />
              ) : (
                <p>{loading ? "Loading..." : name || "Unnamed"}</p>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex items-center space-x-4">
            <Mail />
            <div>
              <Label>Email</Label>
              {isEditing ? (
                <Input value={email} disabled />
              ) : (
                <p>{loading ? "Loading..." : email}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardHeader>
          {isEditing ? (
            <div className="flex items-center space-x-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              disabled={loading}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}
