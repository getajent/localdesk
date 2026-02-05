import { createClient } from '@/lib/supabase-ssr';
import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export interface UserSettings {
    displayName?: string;
    residencyStatus?: 'eu_citizen' | 'non_eu_citizen' | 'unknown';
    occupationStatus?: 'student' | 'employed' | 'self_employed' | 'job_seeker' | 'other';
    hasArrived?: boolean;
    completedSteps?: string[];
}

/**
 * GET /api/settings - Fetch current user's settings
 */
export async function GET() {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch settings from profile
        const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .select('metadata')
            .eq('user_id', user.id)
            .single();

        if (dbError) {
            // No profile found - return empty settings
            if (dbError.code === 'PGRST116') {
                return NextResponse.json({});
            }
            console.error('[GET /api/settings] Database error:', dbError);
            return NextResponse.json(
                { error: 'Failed to fetch settings' },
                { status: 500 }
            );
        }

        return NextResponse.json(profile?.metadata || {});
    } catch (error) {
        console.error('[GET /api/settings] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/settings - Update user settings
 */
export async function PUT(req: Request) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Initialize admin client for bypassing RLS
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Parse request body
        const settings: Partial<UserSettings> = await req.json();

        // Get existing profile/settings
        const { data: existingProfile, error: selectError } = await supabaseAdmin
            .from('profiles')
            .select('metadata')
            .eq('user_id', user.id)
            .single();

        let existingSettings: UserSettings = {};

        if (selectError) {
            if (selectError.code === 'PGRST116') {
                // No profile exists - create one
                const { error: insertError } = await supabaseAdmin
                    .from('profiles')
                    .insert({ user_id: user.id, metadata: {} });

                if (insertError && insertError.code !== '23505') {
                    console.error('[PUT /api/settings] Insert error:', insertError);
                    return NextResponse.json(
                        { error: 'Failed to create profile' },
                        { status: 500 }
                    );
                }
            } else {
                console.error('[PUT /api/settings] Select error:', selectError);
                return NextResponse.json(
                    { error: 'Failed to fetch existing settings' },
                    { status: 500 }
                );
            }
        } else {
            existingSettings = (existingProfile?.metadata as UserSettings) || {};
        }

        // Merge settings
        const mergedSettings = { ...existingSettings, ...settings };

        // Update profile
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ metadata: mergedSettings })
            .eq('user_id', user.id)
            .select('metadata')
            .single();

        if (updateError) {
            console.error('[PUT /api/settings] Update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update settings' },
                { status: 500 }
            );
        }

        return NextResponse.json(updatedProfile?.metadata || mergedSettings);
    } catch (error) {
        console.error('[PUT /api/settings] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
