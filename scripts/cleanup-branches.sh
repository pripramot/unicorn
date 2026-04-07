#!/usr/bin/env bash
# =============================================================================
# 🧹 Branch Cleanup Script — pripramot/unicorn
# =============================================================================
# วิธีใช้:  chmod +x scripts/cleanup-branches.sh && ./scripts/cleanup-branches.sh
# ต้องการ:  gh auth login (เข้าระบบแล้ว)
# =============================================================================
set -euo pipefail

REPO="pripramot/unicorn"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  🧹 GTS Alpha Forensics — Branch Cleanup                   ║"
echo "║  Repository: $REPO                               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ─── Step 1: Close stale PR #19 ─────────────────────────────────────────────
echo "📌 Step 1: ปิด PR #19 (ล้าสมัย)..."
PR19_STATE=$(gh pr view 19 --repo "$REPO" --json state --jq '.state' 2>/dev/null || echo "UNKNOWN")
if [ "$PR19_STATE" = "OPEN" ]; then
  gh pr close 19 --repo "$REPO" \
    --comment "🧹 ปิดอัตโนมัติ: PR นี้ล้าสมัย (behind main 14 commits) — ทำความสะอาด branches"
  echo "   ✅ PR #19 ปิดแล้ว"
else
  echo "   ⏭️  PR #19 ปิดอยู่แล้ว ($PR19_STATE)"
fi
echo ""

# ─── Step 2: Delete merged/duplicate branches (🔴) ──────────────────────────
MERGED_BRANCHES=(
  "copilot/awesome-truri-store"
  "copilot/fix-issue-clarification"
  "copilot/fix-replace-thai-phrases-another-one"
  "copilot/remove-all-branches-except-main"
  "copilot/update-website-name-structure"
  "copilot/scan-remaining-accounts"
  "remove-exposed-credentials"
  "remove-sensitive-data"
)

echo "🔴 Step 2: ลบ branches ที่ merge แล้ว / ซ้ำซ้อน (${#MERGED_BRANCHES[@]} สาขา)..."
for branch in "${MERGED_BRANCHES[@]}"; do
  if gh api "repos/$REPO/git/refs/heads/$branch" --silent 2>/dev/null; then
    gh api --method DELETE "repos/$REPO/git/refs/heads/$branch" --silent 2>/dev/null && \
      echo "   🗑️  ลบแล้ว: $branch" || \
      echo "   ⚠️  ลบไม่ได้: $branch"
  else
    echo "   ⏭️  ไม่พบ: $branch (อาจลบไปแล้ว)"
  fi
done
echo ""

# ─── Step 3: Delete outdated/diverged branches (🟡) ─────────────────────────
STALE_BRANCHES=(
  "copilot/featurefuture-build"
  "copilot/fix-data-leak-issues"
  "copilot/fix-deployment-issues"
  "copilot/fix-pnpm-setup-in-ci-workflow"
  "copilot/fix-pr-issues-notification"
)

echo "🟡 Step 3: ลบ branches ที่ล้าสมัย / diverged (${#STALE_BRANCHES[@]} สาขา)..."
for branch in "${STALE_BRANCHES[@]}"; do
  if gh api "repos/$REPO/git/refs/heads/$branch" --silent 2>/dev/null; then
    gh api --method DELETE "repos/$REPO/git/refs/heads/$branch" --silent 2>/dev/null && \
      echo "   🗑️  ลบแล้ว: $branch" || \
      echo "   ⚠️  ลบไม่ได้: $branch"
  else
    echo "   ⏭️  ไม่พบ: $branch (อาจลบไปแล้ว)"
  fi
done
echo ""

# ─── Step 4: Verify ─────────────────────────────────────────────────────────
echo "✅ Step 4: ตรวจสอบ branches ที่เหลือ..."
echo ""
REMAINING=$(gh api "repos/$REPO/branches" --jq '.[].name' 2>/dev/null)
echo "📋 Branches ที่เหลือ:"
echo "$REMAINING" | while read -r b; do
  if [ "$b" = "main" ]; then
    echo "   🟢 $b (protected)"
  else
    echo "   ⚪ $b"
  fi
done

COUNT=$(echo "$REMAINING" | wc -l)
echo ""
echo "══════════════════════════════════════════════════════════════"
echo "🎉 เสร็จสิ้น! เหลือ $COUNT สาขา"
echo "══════════════════════════════════════════════════════════════"
